/**
 * ══════════════════════════════════════════════════════════════
 * El Expreso Carmesí — Motor de Sonido (Escudos de Estado Fix)
 * sounds.js
 * ══════════════════════════════════════════════════════════════
 */

const Sounds = (() => {
  let muted = false;
  let currentAmbient = null;
  let currentLocationSound = null;

  // 1. CLIMA GLOBAL
  const weather = {
    rain: new Howl({ src: ['music/lluvia.mp3'], loop: true, volume: 0.6, html5: true })
  };

// 2. PISTAS AMBIENTALES
  const tracks = {
    intro: null, 
    // 🛠️ FIX: Subimos el volumen a 0.45
    investigation: new Howl({ src: ['music/jazz.mp3'], loop: true, volume: 0.45, html5: true }),
    accusation: new Howl({ src: ['music/jazz.mp3'], loop: true, volume: 0.2, html5: true }) 
  };
  // 🛠️ FIX: Actualizamos el mapa de volúmenes para que coincida
  const trackVols = { investigation: 0.45, accusation: 0.2 };

  // 3. AMBIENTES DE LOCACIÓN
  const locTracks = {
    comedor: new Howl({ src: ['music/jazz.mp3'], loop: true, volume: 0.4, html5: true }),
    primera: new Howl({ src: ['music/lluvia.mp3'], loop: true, volume: 0.3, html5: true }), 
    bar: new Howl({ src: ['music/bar.mp3'], loop: true, volume: 0.5, html5: true }),
    maquinas: new Howl({ src: ['music/maquinas.mp3'], loop: true, volume: 0.6, html5: true }),
    equipaje: new Howl({ src: ['music/lluvia.mp3'], loop: true, volume: 0.5, html5: true }) 
  };
  const locVols = { comedor: 0.4, primera: 0.3, bar: 0.5, maquinas: 0.6, equipaje: 0.5 };

  // 4. EFECTOS DE SONIDO (SFX)
  const sfx = {
    card_swipe: new Howl({ src: ['music/carta.mp3'], volume: 0.7, html5: true }),
    clue_found: new Howl({ src: ['music/escribir.mp3'], volume: 0.9, html5: true }),
    notebook_open: new Howl({ src: ['music/escribir.mp3'], volume: 0.7, html5: true }),
    tab_scenes: new Howl({ src: ['music/carta.mp3'], volume: 0.5, html5: true }),
    tab_suspects: new Howl({ src: ['music/carta.mp3'], volume: 0.5, html5: true }),
    door_open: new Howl({ src: ['music/puerta.mp3'], volume: 1.0, html5: true }),
    answer_reveal: new Howl({ src: ['music/carta.mp3'], volume: 0.6, html5: true }),
    success: new Howl({ src: ['music/escribir.mp3'], volume: 0.8, html5: true }), 
    failure: new Howl({ src: ['music/puerta.mp3'], volume: 0.4, html5: true }),
    interrogation_start: new Howl({ src: ['music/carta.mp3'], volume: 0.6, html5: true }),
    card_draw: new Howl({ src: ['music/carta.mp3'], volume: 0.5, html5: true }),
    accusation_confirm: new Howl({ src: ['music/puerta.mp3'], volume: 0.8, html5: true })
  };

  return {
    init() { 
      if (!muted && !weather.rain.playing()) {
        weather.rain.play();
      }
    },

playAmbient(type) {
      if (muted) return;

      // 1. Escudo para no reiniciar la misma canción si ya está sonando
      if (currentAmbient === type) return;

      // 2. Apagamos la lluvia si entramos a la pantalla de Investigación
      if (type === 'investigation' && weather.rain.playing()) {
        weather.rain.fade(weather.rain.volume(), 0, 1000); 
        setTimeout(() => weather.rain.pause(), 1000);
      }

      // 3. Detenemos la música de fondo anterior (si había alguna)
      if (currentAmbient && tracks[currentAmbient]) {
        tracks[currentAmbient].stop(); 
      }
      
      currentAmbient = type;
      
      // 4. Disparamos la nueva música FORZANDO el volumen al instante
      if (tracks[type]) {
        const targetVolume = type === 'investigation' ? 0.5 : 0.3;
        tracks[type].volume(targetVolume); // Quitamos el fade-in que causaba el bug
        tracks[type].play();
      }
    },

    stopAmbient(fadeTime = 1.5) {
      if (currentAmbient && tracks[currentAmbient]) {
        const oldTrack = tracks[currentAmbient];
        oldTrack.fade(oldTrack.volume(), 0, fadeTime * 1000);
        setTimeout(() => oldTrack.pause(), fadeTime * 1000);
        currentAmbient = null;
      }
    },

    playLocation(id) {
      if (muted) return;

      // 🛠️ ESCUDO 2: Evita errores si tocas la locación dos veces rápido
      if (currentLocationSound === id) return;

      this.stopLocation(); 
      currentLocationSound = id;
      if (locTracks[id]) {
        locTracks[id].volume(0);
        locTracks[id].play();
        locTracks[id].fade(0, locVols[id] || 0.5, 1000); 
      }
    },

    stopLocation() {
      if (currentLocationSound && locTracks[currentLocationSound]) {
        const oldLoc = locTracks[currentLocationSound];
        oldLoc.fade(oldLoc.volume(), 0, 500);
        setTimeout(() => oldLoc.pause(), 500);
        currentLocationSound = null;
      }
    },

    playSFX(name) {
      if (muted) return;
      if (sfx[name]) {
        sfx[name].stop();
        sfx[name].play();
      } else {
        sfx.card_swipe.play();
      }
    },

    stopSFX(name) {
      if (sfx[name]) sfx[name].stop();
    },

    playWeapon(weaponId) { this.playSFX('card_swipe'); },

    toggleMute() {
      muted = !muted;
      Howler.mute(muted);
      return muted;
    },

    get muted() { return muted; }
  };
})();