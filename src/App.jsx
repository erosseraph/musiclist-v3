import React, { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import SongList from './components/SongList'
import Playlist from './components/Playlist'

export default function App(){
  const [songs, setSongs] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(false)
  const dragIndex = useRef(null)

  useEffect(()=>{
    const saved = localStorage.getItem('musiclist_v3_playlist')
    if(saved){
      try{ setPlaylist(JSON.parse(saved)) }catch{}
    }
    const params = new URLSearchParams(window.location.search)
    const listParam = params.get('list')
    if(listParam){
      const ids = listParam.split(',').filter(Boolean)
      if(ids.length) fetchSongsByIds(ids)
    }
  },[])

  useEffect(()=>{
    localStorage.setItem('musiclist_v3_playlist', JSON.stringify(playlist))
  },[playlist])

  async function fetchSongsByIds(ids){
    setLoading(true)
    const out = []
    for(const id of ids){
      try{
        const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`)
        const j = await res.json()
        if(j.results && j.results.length) out.push(j.results[0])
      }catch(e){}
    }
    setPlaylist(out)
    setLoading(false)
  }

  async function search(term){
    if(!term) return
    setLoading(true)
    let all = []
    const limit = 50
    const maxPages = 4
    for(let i=0;i<maxPages;i++){
      try{
        const offset = i*limit
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}&offset=${offset}`)
        const j = await res.json()
        if(j.results && j.results.length){
          all = all.concat(j.results)
          if(j.results.length < limit) break
        } else break
      }catch(e){ break }
    }
    if(all.length > 200) all = all.slice(0,200)
    setSongs(all)
    setLoading(false)
    const left = document.querySelector('.left .results')
    if(left) left.scrollTop = 0
  }

  function addToPlaylist(track){
    if(playlist.find(p=>p.trackId===track.trackId)){
      alert('这首歌已在你的歌单中！'); return
    }
    setPlaylist(p=>[...p, track])
  }

  function removeFromPlaylist(trackId){
    setPlaylist(p=>p.filter(x=>x.trackId!==trackId))
  }

  function move(index, dir){
    setPlaylist(p=>{
      const copy = [...p]
      const to = index+dir
      if(to<0||to>=copy.length) return copy
      const [it] = copy.splice(index,1)
      copy.splice(to,0,it)
      return copy
    })
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="logoWrap">
          <div className="logoCircle">🎵</div>
          <div className="title">你的专属歌单中心</div>
        </div>
      </header>

      <div className="content">
        <main className="left">
          <SearchBar onSearch={search} loading={loading} />
          <div className="results">
            <SongList songs={songs} onAdd={addToPlaylist} loading={loading} />
          </div>
        </main>

        <aside className="right">
          <Playlist playlist={playlist} onRemove={removeFromPlaylist} onMove={move} />
        </aside>
      </div>
    </div>
  )
}
