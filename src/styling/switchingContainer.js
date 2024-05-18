const switchingContainers = document.getElementsByClassName('switching-container');

for (const switchingContainerWrapper of switchingContainers) {
   const switchingContainer = switchingContainerWrapper.children[0]
   setInterval(() => {
      const children = switchingContainer.children
      const currentElement = children[0]
      const nextElement = children[1]
      switchingContainer.classList.add('--switching');

      setTimeout(() => {
         switchingContainer.appendChild(currentElement.cloneNode(true))
         switchingContainer.removeChild(currentElement)
         switchingContainer.classList.remove('--switching');
      }, 1980)

   }, 2000)
}