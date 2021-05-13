var elmnt = document.querySelector('.demos-section');
var liveDemoBtn = document.querySelectorAll('.demos-btn')

liveDemoBtn.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    elmnt.scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
  })
})
