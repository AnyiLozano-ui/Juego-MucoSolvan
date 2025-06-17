// Lógica de control de vidas y bloqueo para index04-CR.html
(() => {
    // --- Lógica para index04-CR.html ---
    if (window.location.pathname.endsWith('index04-CR.html')) {
        const LIVES_KEY = 'lives';
        const BLOCK_KEY = 'block';
        const BLOCK_HOURS = 24;
        const MS_PER_HOUR = 60 * 60 * 1000;

        const getBlockDate = () => {
            const block = localStorage.getItem(BLOCK_KEY);
            return block ? new Date(block) : null;
        };

        const hoursSince = date => (Date.now() - date.getTime()) / MS_PER_HOUR;

        const setLives = val => localStorage.setItem(LIVES_KEY, val);
        const removeBlock = () => localStorage.removeItem(BLOCK_KEY);

        const disableButtons = () => {
            document.querySelectorAll('.jugar, .adelante').forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            });
        };

        const blockDate = getBlockDate();
        const lives = localStorage.getItem(LIVES_KEY);

        if (blockDate) {
            // Si existe block, validar si han pasado 24 horas
            const elapsed = hoursSince(blockDate);
            if (elapsed >= BLOCK_HOURS) {
                // Han pasado más de 24 horas, quitar block y setear vidas en 3
                removeBlock();
                setLives(3);
            } else {
                // No han pasado 24 horas
                if (lives == null) {
                    // Si no hay vidas, no hacer nada (esperar a que pasen 24h)
                } else if (+lives === 0) {
                    // Si vidas es 0 y block < 24h, deshabilitar botones
                    disableButtons();
                    // Mostrar en consola el tiempo restante y la hora de reactivación
                    const remainingMs = BLOCK_HOURS * MS_PER_HOUR - (Date.now() - blockDate.getTime());
                    const remainingHours = Math.floor(remainingMs / MS_PER_HOUR);
                    const remainingMinutes = Math.floor((remainingMs % MS_PER_HOUR) / (60 * 1000));
                    const reactivationDate = new Date(blockDate.getTime() + BLOCK_HOURS * MS_PER_HOUR);
                    console.log(`Tiempo restante para volver a jugar: ${remainingHours} horas y ${remainingMinutes} minutos.`);
                    console.log(`El juego se reactivará a las: ${reactivationDate.toLocaleString()}`);
                }
                // Si hay vidas (1,2,3), no hacer nada
            }
        } else {
            // No existe block
            if (lives == null || +lives === 0 || +lives === 1 || +lives === 2 || +lives === 3) {
                setLives(3);
            }
            // Si hay vidas (1,2,3,0), no hacer nada
        }
        return;
    }

    // --- Lógica para index05-CR.html, index06-CR.html, index07-CR.html ---
    const validPages = ['index05-CR.html', 'index06-CR.html', 'index07-CR.html'];
    if (validPages.some(page => window.location.pathname.endsWith(page))) {
        const LIVES_KEY = 'lives';
        const lives = +localStorage.getItem(LIVES_KEY);
        if (lives === 0) {
            window.location.replace('index04-CR.html');
            return;
        }

        // Mostrar vidas detrás de modal/modal1
        function showVidasBehindModal() {
            const vidas = [
                document.querySelector('.vida1'),
                document.querySelector('.vida2'),
                document.querySelector('.vida3')
            ];
            const modal = document.querySelector('.modal');
            const modal1 = document.querySelector('.modal1');
            const isModalVisible = modal && getComputedStyle(modal).display === 'block';
            const isModal1Visible = modal1 && getComputedStyle(modal1).display === 'block';
            if (isModalVisible || isModal1Visible) {
                vidas.forEach(vida => {
                    if (vida) vida.style.visibility = 'visible';
                });
            } else {
                vidas.forEach(vida => {
                    if (vida) vida.style.visibility = '';
                });
            }
        }

        // Observar cambios en display de modal/modal1
        function observeModalDisplay() {
            const modals = [document.querySelector('.modal'), document.querySelector('.modal1')];
            modals.forEach(modal => {
                if (!modal) return;
                const observer = new MutationObserver(showVidasBehindModal);
                observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
            });
        }
        observeModalDisplay();
        showVidasBehindModal();

        // Sonidos y lógica de clicks
        const sonidoCorrecta = new Audio('./images/correcta.mp3');
        const sonidoIncorrecta = new Audio('./images/incorrecta.mp3');

        // Click en .buena
        const buena = document.querySelector('.buena');
        const modal1 = document.querySelector('.modal1');
        if (buena) {
            buena.addEventListener('click', () => {
                sonidoCorrecta.currentTime = 0;
                sonidoCorrecta.play();
                buena.style.opacity = '1';
                setTimeout(() => {
                    if (modal1) modal1.style.display = 'block';
                    
                }, 2000);
            });
        }

        // Función para restar vida y ocultar la vida correspondiente
        function restarVidaYActualizar() {
            let lives = +localStorage.getItem(LIVES_KEY);
            if (lives > 0) {
                lives -= 1;
                localStorage.setItem(LIVES_KEY, lives);
                // Ocultar la vida correspondiente
                const vida = document.querySelector('.vida' + (lives + 1));
                if (vida) vida.style.opacity = '0';
            }
        }

        // Mostrar .modal y restar vida al hacer click en mal
        const malClases = Array.from(document.querySelectorAll('[class*="mal"]'));
        const modal = document.querySelector('.modal');
        malClases.forEach(mal => {
            mal.addEventListener('click', () => {
                sonidoIncorrecta.currentTime = 0;
                sonidoIncorrecta.play();
                mal.style.opacity = '1';
                setTimeout(() => {
                    if (modal) {
                        modal.style.display = 'block';
                        restarVidaYActualizar();

                        // Redirección al cerrar modal
                        const closeModal = document.querySelector('.closeModal');
                        if (closeModal) {
                            closeModal.addEventListener('click', () => {
                                const path = window.location.pathname;
                                let nextPage = '';
                                let lives = +localStorage.getItem(LIVES_KEY);
                                if (path.endsWith('index05-CR.html')) {
                                    nextPage = 'index06-CR.html';
                                } else if (path.endsWith('index06-CR.html')) {
                                    nextPage = 'index07-CR.html';
                                } else if (path.endsWith('index07-CR.html')) {
                                    if (lives === 0) {
                                        localStorage.setItem('block', new Date());
                                        nextPage = 'index04-CR.html';
                                    } else {
                                        nextPage = 'index08-CR.html';
                                    }
                                }
                                if (nextPage) window.location.replace(nextPage);
                            });
                        }
                    }
                }, 2000);
            });
        });

        // Cronómetro para #tiempo
        const tiempoElem = document.getElementById('tiempo');
        if (tiempoElem) {
            let tiempo = +tiempoElem.textContent;
            const interval = setInterval(() => {
                if (tiempo > 0) {
                    tiempo--;
                    tiempoElem.textContent = tiempo;
                } else {
                    if (modal) {
                        modal.style.display = 'block';
                        restarVidaYActualizar();

                        // Redirección al cerrar modal
                        const closeModal = document.querySelector('.closeModal');
                        if (closeModal) {
                            closeModal.addEventListener('click', () => {
                                const path = window.location.pathname;
                                let nextPage = '';
                                let lives = +localStorage.getItem(LIVES_KEY);
                                if (path.endsWith('index05-CR.html')) {
                                    nextPage = 'index06-CR.html';
                                } else if (path.endsWith('index06-CR.html')) {
                                    nextPage = 'index07-CR.html';
                                } else if (path.endsWith('index07-CR.html')) {
                                    if (lives === 0) {
                                        localStorage.setItem('block', new Date());
                                        nextPage = 'index04-CR.html';
                                    } else {
                                        nextPage = 'index08-CR.html';
                                    }
                                }
                                if (nextPage) window.location.replace(nextPage);
                            });
                        }
                    }
                    clearInterval(interval);
                }
            }, 1000);
        }

        // Mostrar vidas según el valor de lives al cargar la vista
        function mostrarVidasPorLives() {
            const vidas = [
                document.querySelector('.vida1'),
                document.querySelector('.vida2'),
                document.querySelector('.vida3')
            ];
            const livesActual = +localStorage.getItem(LIVES_KEY);
            vidas.forEach((vida, i) => {
                if (vida) vida.style.opacity = (livesActual > i) ? '1' : '0';
            });
        }
        mostrarVidasPorLives();

        return;
    }

    // --- Lógica para index04-CR.html ---
    if (window.location.pathname.endsWith('index04-CR.html')) {
        const LIVES_KEY = 'lives';
        const BLOCK_KEY = 'block';
        const lives = +localStorage.getItem(LIVES_KEY);
        const block = localStorage.getItem(BLOCK_KEY);
        if (!block && [0,1,2,3].includes(lives)) {
            localStorage.setItem(LIVES_KEY, 3);
        }
    }
})();
