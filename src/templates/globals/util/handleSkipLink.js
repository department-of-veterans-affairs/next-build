export const handleSkipLink = (e) => {
  e.preventDefault()
  const contentDiv = document.getElementById('content')
  const firstH1 = contentDiv && contentDiv.querySelector('h1')
  if (firstH1) {
    firstH1.setAttribute('tabindex', '-1')
    firstH1.focus()

    const h1Position = firstH1.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: h1Position,
    })

    // Cleanup
    firstH1.addEventListener(
      'blur',
      () => {
        firstH1.removeAttribute('tabindex')
      },
      { once: true }
    )
  }
}
