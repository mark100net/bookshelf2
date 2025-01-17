/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from 'react-router-dom'
// 🐨 get useQuery from react-query
import {useQuery} from 'react-query'
// 🐨 you'll also need the client from 'utils/api-client'
import {client} from 'utils/api-client'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {StatusButtons} from './status-buttons'
import {Rating} from './rating'

function BookRow({user, book}) {
  const {title, author, coverImageUrl} = book

  // 🐨 call useQuery here to get the list item
  // queryKey should be 'list-items'
  // queryFn should be a call to the list-items endpoint
  const {data, error, isLoading, isError} = useQuery({
    queryKey: ['list-items'],
    queryFn: () =>
      client('list-items', { token: user.token}).then(data => data.listItems)
  })

  if (isLoading) {
    return null
  }

  if (isError) {
    return "<div>There was an error showing a book</div>"
  }
  
  const listItems = data ?? null

  if (!listItems) {
    return null
  }

  const listItem = listItems.find(item => {
    return item.id === book.id
  })

  const id = `book-row-book-${book.id}`

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Link
        aria-labelledby={id}
        to={`/book/${book.id}`}
        css={{
          minHeight: 270,
          flexGrow: 2,
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gridGap: 20,
          border: `1px solid ${colors.gray20}`,
          color: colors.text,
          padding: '1.25em',
          borderRadius: '3px',
          ':hover,:focus': {
            textDecoration: 'none',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.08)',
            color: 'inherit',
          },
        }}
      >
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 100,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{maxHeight: '100%', width: '100%'}}
          />
        </div>
        <div css={{flex: 1}}>
          <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  margin: '0',
                  color: colors.indigo,
                }}
              >
                {title}
              </h2>
              {listItem?.finishDate ? (
                <Rating user={user} listItem={listItem} />
              ) : null}
            </div>
            <div css={{marginLeft: 10}}>
              <div
                css={{
                  marginTop: '0.4em',
                  fontStyle: 'italic',
                  fontSize: '0.85em',
                }}
              >
                {author}
              </div>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small>{book.synopsis.substring(0, 500)}...</small>
        </div>
      </Link>
      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          color: colors.gray80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <StatusButtons user={user} book={book} />
      </div>
    </div>
  )
}

export {BookRow}
