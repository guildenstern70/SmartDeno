const setFeatureActive = (activeIndex) => {
    for (let j = 0; j < 3; j++) {
        const menuitem = document.getElementById('menuitem' + j);
        menuitem.classList.remove("active");
    }
    const menuitem = document.getElementById('menuitem' + activeIndex);
    menuitem.classList.add("active");
};
