import React from 'react'

export default function Playlist({ playlist, onRemove, onMove }){
  return (
    <div>
      <div className="playlistHeader">
        <h3>🎵 我的歌单</h3>
        <div className="count">{playlist.length} 首</div>
      </div>
      <div className="playlistList">
        {playlist.length===0 && <div className="hint">歌单为空 — 点击“＋加入歌单”把歌曲放进来</div>}
        {playlist.map((p,i)=>(
          <div className="plItem" key={p.trackId} draggable>
            <div className="plLeft">
              <div className="idx">{i+1}.</div>
              <img src={p.artworkUrl100} alt="" />
              <div className="plInfo">
                <div className="t">{p.trackName}</div>
                <div className="a">{p.artistName}</div>
              </div>
            </div>
            <div className="plBtns">
              <button onClick={()=>onMove(i,-1)}>↑</button>
              <button onClick={()=>onMove(i,1)}>↓</button>
              <button onClick={()=>onRemove(p.trackId)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="playlistFooter">
        <button className="shareBtn" onClick={()=>{ if(playlist.length){ const ids = playlist.map(s=>s.trackId).join(','); const url = `${window.location.origin}${window.location.pathname}?list=${ids}`; navigator.clipboard.writeText(url).then(()=>alert('分享链接已复制！')) } else alert('歌单为空') }}>🔗 分享歌单</button>
        <button className="clearBtn" onClick={()=>{ if(confirm('确认清空歌单？')){ window.localStorage.removeItem('musiclist_v3_playlist'); window.location.reload(); } }}>清空</button>
      </div>
    </div>
  )
}
