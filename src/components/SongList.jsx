import React from 'react'

export default function SongList({ songs, onAdd }){
  if(!songs || songs.length===0) return <div className="hint">搜索歌曲或歌手，结果显示在这里。</div>
  return (
    <div className="grid3">
      {songs.map(s=>(
        <div className="card" key={s.trackId}>
          <img src={s.artworkUrl100} alt={s.trackName} />
          <div className="meta">
            <div className="t">{s.trackName}</div>
            <div className="a">{s.artistName}</div>
            <div className="actions">
              <button className="addBtn" onClick={()=>onAdd(s)}>＋ 加入歌单</button>
              {s.previewUrl && <audio className="preview" controls src={s.previewUrl}></audio>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
