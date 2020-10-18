window.onload = function() {
    new Selected().init();
};
var Selected = function() {
    this.audio = document.getElementById('audio');
    this.lyricContainer = document.getElementById('lyricContainer');
    this.playlist = document.getElementById('playlist');
    this.currentIndex = 0;
    this.lyric = null;
};
Selected.prototype = {
    constructor: Selected, //填满原型链
    init: function() {
        var that = this,
            allSongs = this.playlist.children[0].children,
            currentSong, randomSong;
        this.currentIndex = Math.floor(Math.random() * allSongs.length);
        currentSong = allSongs[this.currentIndex];
        randomSong = currentSong.children[0].getAttribute('data-name');
        //handle playlist
        this.playlist.addEventListener('click', function(e) {
            if (e.target.nodeName.toLowerCase() !== 'a') {
                return;
            };
            var allSongs = that.playlist.children[0].children,
                selectedIndex = Array.prototype.indexOf.call(allSongs, e.target.parentNode);
            that.currentIndex = selectedIndex;
            that.setClass(selectedIndex);
            var songName = e.target.getAttribute('data-name');
            that.play(songName);
        }, false);
        this.audio.onended = function() {
            that.playNext(that);
        }
       
        this.audio.onerror = function(e) {
            that.lyricContainer.textContent = '!fail to load the song :(';
        };
        //从文件夹中随机一首歌开始播放
        for (var i = allSongs.length - 1; i >= 0; i--) {
            allSongs[i].className = '';
        };
        currentSong.className = 'current-song';
        this.play(randomSong);
    },
    play: function(songName) {
        var that = this;
        this.audio.src = './content/songs/' + songName + '.mp3';
        //将歌词盒的位置重置
        this.lyricContainer.style.top = '130px';
        //empty the lyric
        this.lyric = null;
        this.lyricContainer.textContent = 'loading...';
        this.audio.oncanplay = function() {
            that.getLyric(that.audio.src.replace('.mp3', '.lrc'));
            this.play();
        };
        //歌词同步在歌词盒
        this.audio.ontimeupdate = function(e) {
            if (!that.lyric) return;
            for (var i = 0, l = that.lyric.length; i < l; i++) {
                if (this.currentTime > that.lyric[i][0]-0.50/*用0.5s预装歌词*/) {
                    //单行显示
                    // that.lyricContainer.textContent = that.lyric[i][1];
                    //歌词滚动
                    var line = document.getElementById('line-' + i),
                        prevLine = document.getElementById('line-' + (i > 0 ? i - 1 : i));
                    prevLine.className = '';
                    line.className = 'current-line';
                    that.lyricContainer.style.top = 130 - line.offsetTop + 'px';
                };
            };
        };
    },
    playNext: function(that) {
        var allSongs = this.playlist.children[0].children,
            nextItem;
        //判断播放结束时是否是最后一首歌
        if (that.currentIndex === allSongs.length - 1) {
            //如果是则从头播放
            that.currentIndex = 0;
        } else {
            //如果不是则播放下一首
            that.currentIndex += 1;
        };
        nextItem = allSongs[that.currentIndex].children[0];
        that.setClass(that.currentIndex);
        var songName = nextItem.getAttribute('data-name');
        that.play(songName);
    },
    setClass: function(index) {
        var allSongs = this.playlist.children[0].children;
        for (var i = allSongs.length - 1; i >= 0; i--) {
            allSongs[i].className = '';
        };
        allSongs[index].className = 'current-song';
    },
    getLyric: function(url) {
        var that = this,
            request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'text';
        request.onload = function() {
            that.lyric = that.parseLyric(request.response);
            //将歌词显示在页面
            that.appendLyric(that.lyric);
        };
        request.onerror = function(e) {
            that.lyricContainer.textContent = '!failed to load the lyric :(';
        }
        this.lyricContainer.textContent = 'loading lyric...';
        request.send();
    },
    parseLyric: function(text) {
        //从lrc文件中获取每一行歌词
        var lines = text.split('\n'),
            //在这个正则表达式计算[00.12.78]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [];
        //排除歌词的描述部分或空部分
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //删除最后一个空项目
        lines[lines.length - 1].length === 0 && lines.pop();
        //显示页面上的所有内容
        lines.forEach(function(v, i, a) {
            var time = v.match(pattern),
                value = v.replace(pattern, '');
            time.forEach(function(v1, i1, a1) {
                //将[min：SEC]转换成SECs格式，然后存入结果
                var t = v1.slice(1, -1).split(':');
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
            });
        });
        //将结果按照时间排序
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
        return result;
    },
    appendLyric: function(lyric) {
        var that = this,
            lyricContainer = this.lyricContainer,
            fragment = document.createDocumentFragment();
        //一开始先将歌词盒清空
        this.lyricContainer.innerHTML = '';
        lyric.forEach(function(v, i, a) {
            var line = document.createElement('p');
            line.id = 'line-' + i;
            line.textContent = v[1];
            fragment.appendChild(line);
        });
        lyricContainer.appendChild(fragment);
    }
}
