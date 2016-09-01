var Bomberman = Bomberman || {};

// New Game
Bomberman.game = new Phaser.Game(600, 520, Phaser.AUTO, "");

function init(){
  // Initialize States
  Bomberman.game.state.add('Boot', Bomberman.Boot);
  Bomberman.game.state.add('Preload', Bomberman.Preload);
  Bomberman.game.state.add('Menu', Bomberman.Menu);
  Bomberman.game.state.add('Game', Bomberman.Game);
  Bomberman.game.state.add('End', Bomberman.End);

  // Start the game!
  Bomberman.game.state.start('Boot');
}

var konamiIdx = 0;
function konamiCheck(keycode){
  var konamiCodeKeyCodes = [38,38,40,40,37,39,37,39,66,65];
    if (keycode === konamiCodeKeyCodes[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiCodeKeyCodes.length) {
        // alert("YOU ARE AN EVENT HANDLER GURUUUUUUUUU!");
        return true;
      }
    } else {
      konamiIdx = 0;
      return false;
    }
}