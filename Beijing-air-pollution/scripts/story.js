function scrollAppear() {
    var introText = document.querySelector(".intro-text");
    var introPosition = introText.getBoundingClientRect().top;
    var screenPosition = window.innerHeight / 1.3;
    console.log(introPosition);
    console.log(screenPosition);

    if (introPosition < screenPosition) {
        introText.classList.add('intro-appear')
    }
}

window.addEventListener('scroll', scrollAppear);