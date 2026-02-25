(function () {

    // VÍDEO NO CARD ------------------- (clique no play ou thumbnail reproduz automaticamente)
    const thumbnails = document.querySelectorAll('.video-thumb');
    let activePlayer = null; // controla player atualmente visível

    thumbnails.forEach((thumb, idx) => {
        thumb.addEventListener('click', function (e) {
            e.stopPropagation();
            const card = this.closest('.person-card');
            const videoId = card.dataset.videoId;
            if (!videoId) return;

            const playerDiv = card.querySelector('.video-player');
            const thumbDiv = card.querySelector('.video-thumb');

            // Se já existe um player ativo e é diferente deste, remover o anterior
            if (activePlayer && activePlayer !== playerDiv) {
                activePlayer.style.display = 'none';
                activePlayer.innerHTML = ''; // remove iframe (pausa o vídeo)
                const prevThumb = activePlayer.closest('.person-card').querySelector('.video-thumb');
                if (prevThumb) prevThumb.style.display = 'flex';
            }

            // Se o player atual está oculto, mostrar e carregar com autoplay
            if (playerDiv.style.display !== 'block') {
                // Esconde thumbnail
                thumbDiv.style.display = 'none';
                // Verifica se videoId é válido antes de criar o iframe
                if (videoId) {
                    playerDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                    playerDiv.style.display = 'block';
                    activePlayer = playerDiv;
                } else {
                    console.error('Video ID is invalid:', videoId);
                }
            } else {
                // Se clicar no mesmo thumbnail (já ativo), mantém como está ou pode pausar? (deixamos tocando)
            }
        });
    });
})();