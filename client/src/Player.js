import React from 'react'
function Player({accessToken, trackUri}) {
  if(!accessToken) return null
  return (
    <div>
      <iframe
        title='player'
        src={`https://open.spotify.com/embed/track/${trackUri?.split(':')[2]}?utm_source=generator`}
        width='100%'
        height='100'
        frameBorder='0'
        allowfullscreen=''
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        loading='lazy'
      />
    </div>
  )
}

export default Player