/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {BrowserRouter as Router} from 'react-router-dom'
// 🐨 you'll need the queryCache from react-query
import {queryCache} from 'react-query'
import {FullPageSpinner} from './components/lib'
import * as colors from './styles/colors'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function App() {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    // 🐨 clear the query cache with queryCache.clear()
    queryCache.clear()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isSuccess) {
    const props = {user, login, register, logout}
    return user ? (
      <Router>
        <AuthenticatedApp {...props} />
      </Router>
    ) : (
      <UnauthenticatedApp {...props} />
    )
  }
}

export {App}
