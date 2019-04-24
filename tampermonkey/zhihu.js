// ==UserScript==
// @name         search-zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/collection/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    const server = 'http://47.52.42.134:8002'

    const title = document.querySelector('.zg-section-title');
    const search = document.createElement('div');
    search.innerHTML = `<input type="text" id="search-collection-input" placeholder="输入关键字搜索收藏夹,回车确认"/><style>
    #search-collection-input{-webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        cursor: pointer;}
    #search-collection-input:focus{outline: none;border-color: #409eff;}
    </style>`;
    title.appendChild(search);


    search.childNodes[0].addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            collectPage(this.value, 1, Date.now());// 从第一页开始筛选
        }
    })

    window.addEventListener('load', function(){
        const keywords = getUrlParams('keywords');
        const queryId = getUrlParams('queryId');
        if(keywords && queryId){// 收集
            collect(queryId, keywords);
        }
    })

    function getUrlParams(key) {
        const search = location.search.substring(1);
        const reg = new RegExp(`(?:^|&)${key}=(.*?)(?:&|$)`);
        const match = reg.exec(search);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function collectPage(keywords, page, queryId){
        location.href = `${location.origin}${location.pathname}?keywords=${keywords}&page=${page}&queryId=${queryId}`
    }

    function collect(queryId, keywords){
        const matchReg = new RegExp(keywords, 'i');
        const items = [...document.querySelectorAll('.zm-item')]
        const matches = [];
        items.forEach(item => {
            const title = item.querySelector('.zm-item-title');
            if(matchReg.test(title.textContent)){
                matches.push({
                    title: item.querySelector('.zm-item-title').textContent,
                    link: item.querySelector('.zm-item-title a').href,
                    author: item.querySelector('.author-link').textContent,
                    authorLink: item.querySelector('.author-link').href,
                    star: item.querySelector('.zm-item-vote-count').textContent
                });
            }
        })
        
        const xhr = new XMLHttpRequest();
        xhr.open('post', server+ '/zhihu/collect/'+queryId);
        xhr.onreadystatechange = function(){
            if(xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE){
                const result = JSON.parse(xhr.responseText);
                if(result.code === 0){
                    const curPage = 1*getUrlParams('page');
                    const lastPage = document.querySelector('.border-pager span:nth-last-child(2)');
                    const maxPage = lastPage ? lastPage.textContent*1 : 1;
                    if(curPage < maxPage){// 打开下一页筛选
                        collectPage(keywords, curPage+1, queryId);
                    } else {// 新标签页打开结果页
                        window.open(server + `/zhihu/list/`+queryId, '_blank')
                    }
                } else {
                    alert(`出错了${result.code}, ${result.msg}`)
                }
            }
        }
        xhr.send(JSON.stringify(matches));
    }
})();