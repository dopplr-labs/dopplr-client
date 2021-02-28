import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'antd'
import AuthContext from 'contexts/auth-context'

export default function Navbar() {
  const { user, signOut } = useContext(AuthContext)

  return (
    <div className="relative z-50 flex items-center h-12 px-8 shadow-xl bg-brand-dark">
      <Link to="/" className="flex items-center">
        <img
          src={require('images/logo-transparent.svg').default}
          alt="Dopplr"
          className="w-8 h-8 mr-2"
        />
        <div className="text-base font-bold text-white">Dopplr</div>
      </Link>
      <div className="flex-1" />
      {user ? (
        <Dropdown
          overlay={
            <Menu className="w-56 divide-y text-content-primary">
              <div className="px-4 py-2">
                <div>{user?.displayName}</div>
                <div className="text-xs text-content-tertiary">
                  {user?.email}
                </div>
              </div>
              <div className="px-4 py-2 cursor-pointer hover:bg-background-primary">
                <Button className="w-full" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </Menu>
          }
          trigger={['click']}
        >
          <button className="w-8 h-8 overflow-hidden rounded-full bg-background-primary focus:outline-none">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="user profile" />
            ) : null}
          </button>
        </Dropdown>
      ) : null}
    </div>
  )
}
