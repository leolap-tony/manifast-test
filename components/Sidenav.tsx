import React from 'react'

const Sidenav = () => {
  return (
    <aside className="flex flex-col w-64 h-full min-h-screen p-5 bg-slate-300">
      <nav className="flex-1">
        <ul className="flex flex-col">
          <li className="py-2 px-4">Home</li>
          <li className="py-2 px-4">About</li>
          <li className="py-2 px-4">Contact</li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidenav