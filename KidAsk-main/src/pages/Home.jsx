import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router"
import UserContext from "../context/UserContext"

export default function Home() {
  const [help, setHelp] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const handleChange = (e) => {
    setHelp(e.target.value === '1')
  }

  const { setUser } = useContext(UserContext)

  useEffect(() => {
    window.localStorage.removeItem('user')
  }, [])

  const done = () => {
    setUser({
      help
    })
    setRedirect(true)
  }

  return <div>
    {
      redirect &&
      <Redirect to="/intro" />
    }
    <select onChange={handleChange}>
      <option value="1">experimental</option>
      <option value="0">control</option>
    </select>
    <button onClick={done}>Go</button>
  </div>

}
