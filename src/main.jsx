import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chess } from 'chess.js';
import './style.css';

function App() {
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState(null);
  const [orientation, setOrientation] = useState('w');
  const [notice, setNotice] = useState('Your move. Tap a piece, then a destination.');
  const board = useMemo(() => {
    const rows = game.board();
    if (orientation === 'b') rows.reverse().forEach(row => row.reverse());
    return rows;
  }, [game, orientation]);
  const files = orientation === 'w' ? 'abcdefgh'.split('') : 'hgfedcba'.split('');
  const ranks = orientation === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const legal = selected ? game.moves({ square: selected, verbose: true }).map(m => m.to) : [];
  const status = game.isCheckmate() ? `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins` :
    game.isDraw() ? 'Draw' : game.isCheck() ? 'Check!' : `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  function squareName(r,c) { return files[c] + ranks[r]; }
  function clickSquare(sq) {
    if (selected && legal.includes(sq)) {
      try {
        const next = new Chess(game.fen()); next.move({from:selected,to:sq,promotion:'q'});
        setGame(next); setSelected(null); setNotice(next.isGameOver() ? 'Game over.' : 'Move played.');
        return;
      } catch {}
    }
    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) { setSelected(sq); setNotice(`Selected ${sq}. Choose a highlighted square.`); }
    else { setSelected(null); setNotice('Select one of your pieces.'); }
  }
  function reset() { setGame(new Chess()); setSelected(null); setNotice('New game started.'); }
  return <div className="ka-wrap">
    <header className="ka-header"><div className="ka-logo">♞</div><div><strong>KnightArena</strong><small>CHESS ARENA</small></div><span className="ka-badge">LOCAL PLAY</span></header>
    <main className="ka-main"><section className="ka-intro"><p className="ka-eyebrow">WELCOME TO THE ARENA</p><h1>Make your <em>next move.</em></h1><p>Play a chess game on this device.</p></section>
    <section className="ka-game"><div className="ka-game-head"><div><small>GAME STATUS</small><h2>{status}</h2></div><span className="ka-turn">{game.turn()==='w'?'♔ WHITE':'♚ BLACK'}</span></div>
    <div className="ka-board" role="grid">{board.map((row,r)=>row.map((piece,c)=>{const sq=squareName(r,c); const light=(r+c)%2===0; return <button key={sq} aria-label={sq} onClick={()=>clickSquare(sq)} className={`ka-square ${light?'light':'dark'} ${selected===sq?'selected':''} ${legal.includes(sq)?'legal':''}`}>{piece ? <span className={`piece ${piece.color==='w'?'white-piece':'black-piece'}`}>{({'wk':'♔','wq':'♕','wr':'♖','wb':'♗','wn':'♘','wp':'♙','bk':'♚','bq':'♛','br':'♜','bb':'♝','bn':'♞','bp':'♟'})[piece.color+piece.type]}</span>:null}{c===0&&<i className="rank">{ranks[r]}</i>}{r===7&&<i className="file">{files[c]}</i>}</button>}))}</div>
    <div className="ka-notice">{notice}</div><div className="ka-actions"><button onClick={reset} className="primary">New game</button><button onClick={()=>{setOrientation(o=>o==='w'?'b':'w');setSelected(null)}}>Flip board</button><button onClick={()=>{const p=game.pgn();navigator.clipboard?.writeText(p).then(()=>setNotice('PGN copied.')).catch(()=>setNotice(p||'No moves to export yet.'));}}>Copy PGN</button></div>
    <div className="ka-moves"><small>MOVE HISTORY</small><p>{game.history().length ? game.history().map((m,i)=>(i%2===0?`${Math.floor(i/2)+1}. `:'')+m).join('  ') : 'Moves will appear here as you play.'}</p></div></section>
    <p className="ka-foot">KnightArena is currently a local-play demo. Online multiplayer is not enabled yet.</p></main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
