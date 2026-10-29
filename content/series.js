/* ==========================================================================
   사진 시리즈 관리 파일  (이 파일만 고치면 됩니다)
   --------------------------------------------------------------------------
   · 아래 목록의 "순서" = 메인 화면에 보이는 시리즈 순서입니다.
     순서를 바꾸려면 { ... }, 덩어리를 통째로 잘라서 원하는 위치에 붙여넣으세요.
   · 사진 파일은 photos/<시리즈 id>/ 폴더에 넣습니다.
   · 쉼표(,) 따옴표(") 중괄호({ }) 대괄호([ ])를 지우지 않도록 주의하세요.
     (실수해도 브라우저 개발자도구(F12) 콘솔에 어디가 문제인지 안내가 나옵니다.)

   시리즈 한 개의 모양
   {
     id:     "australia26",          // 영문 소문자/숫자/하이픈. 폴더 이름과 같게 쓰는 것을 권장. 다른 시리즈와 겹치면 안 됨
     title:  "Australia",            // 화면에 보이는 제목
     year:   "26'",                  // 화면에 보이는 연도 표시 (아무 글자나 가능)
     show:   true,                   // false 로 바꾸면 사이트에서 숨김 (파일/데이터는 그대로 보관)
     cover:  "cover.webp",           // 메인 화면 대표 사진 (photos/<id>/ 안의 파일 이름)
     photos: [                       // 시리즈 안의 사진. 쓴 순서대로 표시됨
       "01.webp",                    // 파일 이름만 쓰면 됩니다
       { file: "06.webp",            // 촬영 정보(EXIF)를 직접 적고 싶을 때는 이렇게
         meta: { camera: "COOLPIX AW110s", lens: "", focal: "20 mm", aperture: "f/4.6",
                 shutter: "1/1000 s", iso: "ISO 125", date: "2026.01.01" } },
     ]
   }
   meta 안의 항목은 전부 선택사항이며, 적은 항목만 사진 상세 화면에 나타납니다.
   meta 를 아예 쓰지 않으면 "No EXIF metadata found." 라고 표시됩니다.
   ========================================================================== */

window.PORTFOLIO_SERIES = [


  {
    id: "austria26",
    title: "Austria",
    year: "26'",
    show: true,
    cover: "12.webp",
    photos: [
        { file: "01.webp", meta: { camera: "NIKON D7500", focal: "87 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "ISO 200" } },
        { file: "02.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/7.1", shutter: "1/500 s", iso: "ISO 200" } },
        { file: "03.webp", meta: { camera: "NIKON D7500", focal: "66 mm", aperture: "f/11", shutter: "1/400 s", iso: "ISO 200" } },
        { file: "04.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/8", shutter: "1/1000 s", iso: "ISO 100" } },
        { file: "05.webp", meta: { camera: "NIKON D7500", focal: "78 mm", aperture: "f/8", shutter: "1/250 s", iso: "ISO 160" } },
        { file: "06.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "ISO 250" } },
        { file: "07.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/10", shutter: "1/800 s", iso: "ISO 100" } },
        { file: "08.webp", meta: { camera: "NIKON D7500", focal: "78 mm", aperture: "f/4", shutter: "1/60 s", iso: "ISO 1000" } },
        { file: "09.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/11", shutter: "1/400 s", iso: "ISO 200" } },
        { file: "10.webp", meta: { camera: "NIKON D7500", focal: "52 mm", aperture: "f/9", shutter: "1/100 s", iso: "ISO 320" } },
        { file: "11.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/2.8", shutter: "1/30 s", iso: "ISO 800" } },
        { file: "12.webp", meta: { camera: "NIKON D7500", focal: "60 mm", aperture: "f/10", shutter: "1/200 s", iso: "ISO 400" } },
        { file: "13.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/8", shutter: "1/500 s", iso: "ISO 100" } },
        { file: "14.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/8", shutter: "1/500 s", iso: "ISO 125" } },
        { file: "15.webp", meta: { camera: "NIKON D7500", focal: "78 mm", aperture: "f/11", shutter: "1/500 s", iso: "ISO 125" } },
        { file: "16.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/8", shutter: "1/500 s", iso: "ISO 110" } },
        { file: "17.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "ISO 200" } },
        { file: "18.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/9", shutter: "1/640 s", iso: "ISO 100" } },
        { file: "19.webp", meta: { camera: "NIKON D7500", focal: "78 mm", aperture: "f/8", shutter: "1/250 s", iso: "ISO 180" } },
        ],
    },

  {
    id: "nonsan26",
    title: "Nonsan",
    year: "26'",
    show: true,
    cover: "04.webp",
    photos: [
      { file: "01.webp", meta: { camera: "COOLPIX AW110s", focal: "11.7 mm", aperture: "f/4.2", shutter: "1/1250 s", iso: "ISO 125" } },
      { file: "02.webp", meta: { camera: "COOLPIX AW110s", focal: "15 mm", aperture: "f/4.4", shutter: "1/800 s", iso: "ISO 125" } },
      { file: "03.webp", meta: { camera: "COOLPIX AW110s", focal: "25 mm", aperture: "f/4.8", shutter: "1/640 s", iso: "ISO 125" } },
      { file: "04.webp", meta: { camera: "COOLPIX AW110s", focal: "25 mm", aperture: "f/4.8", shutter: "1/1000 s", iso: "ISO 125" } },
      { file: "05.webp", meta: { camera: "COOLPIX AW110s", focal: "21 mm", aperture: "f/4.7", shutter: "1/1660 s", iso: "ISO 125" } },
        ],
    },

  {
    id: "australia26",
    title: "Australia",
    year: "26'",
    show: true,
        cover: "cover.webp",
    photos: [
      { file: "01.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/7.1", shutter: "1/800 s", iso: "ISO 100" } },
      { file: "02.webp", meta: { camera: "COOLPIX AW110s", focal: "28 mm", aperture: "f/3.9", shutter: "1/60 s", iso: "ISO 400" } },
      { file: "03.webp", meta: { camera: "NIKON D7500", focal: "52 mm", aperture: "f/10.0", shutter: "1/400 s", iso: "ISO 100" } },
      { file: "04.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "05.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/6.3", shutter: "1/640 s", iso: "ISO 100" } },
      { file: "06.webp", meta: { camera: "COOLPIX AW110s", focal: "20 mm", aperture: "f/4.6", shutter: "1/1000 s", iso: "ISO 125" } },
      { file: "07.webp", meta: { camera: "COOLPIX AW110s", focal: "65 mm", aperture: "f/4.2", shutter: "1/320 s", iso: "ISO 125" } },
      { file: "08.webp", meta: { camera: "COOLPIX AW110s", focal: "109 mm", aperture: "f/4.6", shutter: "1/1000 s", iso: "ISO 125" } },
      { file: "09.webp", meta: { camera: "COOLPIX AW110s", focal: "28 mm", aperture: "f/3.9", shutter: "1/800 s", iso: "ISO 125" } },
      { file: "10.webp", meta: { camera: "COOLPIX AW110s", focal: "109 mm", aperture: "f/4.6", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "11.webp", meta: { camera: "COOLPIX AW110s", focal: "55 mm", aperture: "f/4.1", shutter: "1/1000 s", iso: "ISO 125" } },
      { file: "12.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/320 s", iso: "ISO 125" } },
      { file: "13.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/640 s", iso: "ISO 125" } },
      { file: "14.webp", meta: { camera: "NIKON D7500", focal: "105 mm", aperture: "f/6.3", shutter: "1/640 s", iso: "ISO 100" } },
      { file: "15.webp", meta: { camera: "COOLPIX AW110s", focal: "168 mm", aperture: "f/4.8", shutter: "1/640 s", iso: "ISO 125" } },
      { file: "16.webp", meta: { camera: "COOLPIX AW110s", focal: "100 mm", aperture: "f/4.6", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "17.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/250 s", iso: "ISO 125" } },
      { file: "18.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/500 s", iso: "ISO 125" } }
    ],
  },

  {
    id: "hawaii24",
    title: "Hawaii",
    year: "24'",
    show: true,
    cover: "cover.webp",
    photos: [
      { file: "01.webp", meta: { camera: "COOLPIX AW110s", focal: "12 mm", aperture: "f/4.2", shutter: "1/320 s", iso: "ISO 125" } },
      { file: "02.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/320 s", iso: "ISO 125" } },
      { file: "03.webp", meta: { camera: "NIKON D7500", focal: "300 mm", aperture: "f/7.1", shutter: "1/1667 s", iso: "ISO 200" } },
      { file: "04.webp", meta: { camera: "COOLPIX AW110s", focal: "78 mm", aperture: "f/4.4", shutter: "1/640 s", iso: "ISO 125" } },
      { file: "05.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "06.webp", meta: { camera: "COOLPIX AW110s", focal: "140 mm", aperture: "f/4.8", shutter: "1/320 s", iso: "ISO 125" } },
      { file: "07.webp", meta: { camera: "COOLPIX AW110s", focal: "65 mm", aperture: "f/4.2", shutter: "1/800 s", iso: "ISO 125" } },
      { file: "08.webp", meta: { camera: "COOLPIX AW110s", focal: "65 mm", aperture: "f/4.2", shutter: "1/800 s", iso: "ISO 125" } },
    ],
  },

  {
    id: "japan24",
    title: "Japan",
    year: "24'",
    show: true,
    cover: "cover.webp",
    photos: [
      { file: "01.webp", meta: { camera: "iPhone 13", focal: "5 mm", aperture: "f/1.6", shutter: "1/6494 s", iso: "ISO 50" } },
      { file: "02.webp", meta: { camera: "iPhone 13", focal: "5 mm", aperture: "f/1.6", shutter: "1/727 s", iso: "ISO 50" } },
      { file: "03.webp", meta: { camera: "iPhone 13", focal: "5 mm", aperture: "f/1.6", shutter: "1/2967 s", iso: "ISO 50" } },
      { file: "04.webp", meta: { camera: "COOLPIX AW110s", focal: "33 mm", aperture: "f/3.9", shutter: "1/100 s", iso: "ISO 400" } },
      { file: "05.webp", meta: { camera: "COOLPIX AW110s", focal: "55 mm", aperture: "f/4.1", shutter: "1/30 s", iso: "ISO 200" } },
      { file: "06.webp", meta: { camera: "COOLPIX AW110s", focal: "55 mm", aperture: "f/4.1", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "07.webp", meta: { camera: "iPhone 13", focal: "26 mm", aperture: "f/1.6", shutter: "1/2222 s", iso: "ISO 50" } },
      { file: "08.webp", meta: { camera: "COOLPIX AW110s", focal: "91 mm", aperture: "f/4.5", shutter: "1/800 s", iso: "ISO 125" } },
    ],
  },

  {
    id: "japan23",
    title: "Japan",
    year: "23'",
    show: true,
    cover: "cover.webp",
    photos: [
      { file: "01.webp", meta: { camera: "COOLPIX AW110s", focal: "28 mm", aperture: "f/3.9", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "02.webp", meta: { camera: "COOLPIX AW110s", focal: "128 mm", aperture: "f/4.7", shutter: "1/100 s", iso: "ISO 400" } },
      { file: "05.webp", meta: { camera: "COOLPIX AW110s", focal: "71 mm", aperture: "f/8.6", shutter: "1/400 s", iso: "ISO 125" } },
      { file: "04.webp", meta: { camera: "COOLPIX AW110s", focal: "71 mm", aperture: "f/4.3", shutter: "1/50 s", iso: "ISO 400" } },
      { file: "03.webp", meta: { camera: "COOLPIX AW110s", focal: "33 mm", aperture: "f/3.9", shutter: "1/1500 s", iso: "ISO 125" } },
      { file: "06.webp", meta: { camera: "COOLPIX AW110s", focal: "25 mm", aperture: "f/4.8", shutter: "1/125 s", iso: "ISO 400" } },
      { file: "07.webp", meta: { camera: "COOLPIX AW110s", focal: "117 mm", aperture: "f/4.7", shutter: "1/1000 s", iso: "ISO 125" } },
    ],
  },


];
