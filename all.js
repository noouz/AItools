//首頁定價burger menu
$(".navbar-btn").click(function(){
  //漢堡關閉切換
  var currentText = $('.menubtn').html();
  if (currentText === 'menu') {
    $('.menubtn').html('close');
  } else {
    $('.menubtn').html('menu');
  }

    $(".navbar-collapse").toggleClass("show");
    $("main").toggleClass("hide");
    $(".applications").toggleClass("hide");
    $("footer").toggleClass("bottom");
    $("footer").find(".toTop").toggleClass("hide");

})

//打開menu狀態下放大視窗時取消menu顯示
$(window).resize(function() {
  if ($(window).width() >= 601) {
    $(".navbar-collapse").removeClass("show");
    $("main").removeClass("hide");
    $(".applications").removeClass("hide");
    $("footer").removeClass("bottom");
    $("footer").find(".toTop").removeClass("hide");
    $('.menubtn').html('menu');
  } 
});


//問題顯示/隱藏
$(".questions-item2-ul li").click(function() {
    $(this).find(".answer").slideToggle();
    $(this).find(".add").toggle();
    $(this).find(".remove").toggle();
  })

//To top
  $('.toTop').click(function(){
    $('html,body').animate({ scrollTop: 0 },'slow');   /* 返回到最頂上 */
    return false;
});

//評論carousel
$('.owl-carousel').owlCarousel({
    loop:false,
    margin:24,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        720:{
            items:2
        },
        970:{
          items:2
      },
        1000:{
            items:3
        }
    }
})

//篩選+排序清單顯示/隱藏
$('.inputbtn').click(function(){
    $(this).addClass("inputbtn-current").siblings().removeClass('inputbtn-current');
})

//分類按鈕互動
$('.input-btn').click(function(){
    $(this).find("input").toggleClass("input-active");
    $(this).find('.hide').toggle();
})


// 資料串接  (以下有參考範例)
// 課程期間限定開放API已失效
const apiPath = 'https://2023-engineer-camp.zeabur.app';
const list = document.querySelector('#list');
const pagination = document.querySelector('#pagination');

const data = {
  type: '',
  sort: 0,
  page: 1,
  search: '',
}

let worksData = []
let pagesData = {}

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${type ? `type=${type}&` : ''}${search ? `search=${search}` : ''}`
  axios.get(apiUrl)
    .then((res) => {
      worksData = res.data.ai_works.data;
      pagesData = res.data.ai_works.page;

      renderWorks();
      renderPages();
    })
}

getData(data);

// 作品選染至畫面
function renderWorks() {
  let works = '';

  worksData.forEach((item) => {
    works += /*html*/`<li class="tools-list-item">
        <img class="card-img" src="${item.imageUrl}" alt="ai image">
        <div class="tools-list-item-text">
          <h3 >${item.title}</h3>
          <p >${item.description}</p>
        </div>
        <div class="tools-list-item-tag">
          <h4>AI 模型</h4>
          <span>${item.model}</span>
        </div>
        <div class="tools-list-item-tag">
          <p>#${item.type}</p>
          <a href="${item.link}" target="_blank">
          <span class="material-symbols-outlined">share</span>
          </a>
        </div>
    </li>`
  });
  
  //此分類撈不到資料時提示"目前尚無資料"
  if(works.length === 0){
    works += /*html*/`<div class="noItem">目前尚無資料</div>`
  }

  list.innerHTML = works;
}

// 切換分頁
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll('a.page-link')
  let pageId = '';

  pageLinks.forEach((item) => {

    item.addEventListener('click', (e) => {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1
      }

      getData(data);
    });
  });
}

// 分頁選染至畫面
function renderPages() {
  let pageStr = '';

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/`<li class="pagebtn ${pagesData.current_page == i ? 'pagebtn-current' : ''}" >
      <a class="page-link ${pagesData.current_page == i ? 'disabled' : ''}" href="#"  data-page="${i}">${i}</a>
    </li>`
  };

  if (pagesData.has_next) {
    pageStr +=  /*html*/`<li class="pagebtn">
      <a class="page-link" href="#">
      <span class="material-symbols-outlined">keyboard_arrow_right</span>
      </a>
    </li>`
  };
  pagination.innerHTML = pageStr

  changePage(pagesData);
}

// 切換作品排序
const desc = document.querySelector('#desc');
const asc = document.querySelector('#asc');
const btnSort = document.querySelector('#btn-sort');
//  由新到舊 -> sort = 0
desc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.value = '由新到舊';
})
//  由舊到新 -> sort = 1
asc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 1
  getData(data);
  btnSort.value = '由舊到新';
})

// 切換作品類型
const filterBtns = document.querySelectorAll('#filter-btn li a')
filterBtns.forEach((item) => {
  item.addEventListener('click', () => {
    if (item.textContent === '全部') {
      data.type = '';
    } else {
      data.type = item.textContent;
    }
    getData(data)
  })
})

// 搜尋
const search = document.querySelector('#search');
const placeholder = document.querySelector('.placeholder');
search.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        data.search = search.value
        data.page = 1
        getData(data);
    }
    
    //顯示/隱藏placeholder
    search.addEventListener('blur', function() {
        if (search.value !== '' ){
            placeholder.style.visibility = "hidden";
        }else{
            placeholder.style.visibility = "visible";
        }
    });

})
