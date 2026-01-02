// import React from 'react'
// import EventCountdown from './Components/EventCountdown'
// import Event from '../Practice/Event'
// import MainShared from '../SharedLikedButton/MainShared'
// import CounterReducer from '../SharedLikedButton/CounterReducer'


// const App = () => {
//   return (
//     <div>
//       {/* <EventCountdown /> */}
//       {/* <Event /> */}
//       {/* <MainShared /> */}
//       <CounterReducer />
//     </div>
//   )
// }

// export default App

import React from 'react'
import LikesProvider from '../LikedButton/LikesProvider'
import Sidebar from '../SharedLikedButton/Sidebar'
import Feed from '../SharedLikedButton/Feed'
import Header from '../SharedLikedButton/Header'

const App = () => {
  return (
    <LikesProvider>
      <Header />
      <Feed />
      <Sidebar />
    </LikesProvider>
  )
}

export default App
