import React, { useState } from 'react'

export default function SearchBar({ onSearch, loading }){
  const [term, setTerm] = useState('')
  return (
    <div className="searchRow stickyTop">
      <input placeholder="搜索歌手或歌曲..." value={term} onChange={e=>setTerm(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') onSearch(term) }} />
      <button onClick={()=>onSearch(term)} disabled={loading}>{loading ? '搜索中...' : '搜索'}</button>
    </div>
  )
}
