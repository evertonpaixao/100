document.addEventListener("DOMContentLoaded", function () {

    const items = document.querySelectorAll(".acordeon-item");

    items.forEach(item => {
        const header = item.querySelector(".box-title");
        const content = item.querySelector(".content");

        // Se já começa ativo, define altura automática
        if (item.classList.contains("active")) {
            content.style.height = content.scrollHeight + "px";
        }

        header.addEventListener("click", function () {

            const isActive = item.classList.contains("active");

            // Fecha todos
            items.forEach(el => {
                el.classList.remove("active");
                const elContent = el.querySelector(".content");
                elContent.style.height = 0;
            });

            // Se não estava ativo, abre ele
            if (!isActive) {
                item.classList.add("active");
                content.style.height = content.scrollHeight + "px";
            }
        });
    });

});