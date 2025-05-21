import { observer } from 'mobx-react-lite'
import classes from './Home.module.scss'
import { useBookStore } from '@/hooks'
import { Button, Card, Popconfirm, Spin } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import BookModal from './BookModal'

const Home = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { books, isLoading, deleteBook } = useBookStore();

  const onDelete = async (bookId: string) => {
    await deleteBook(bookId);
  }

  return (
    <>
      <div className={classes.container}>
        <Card variant='borderless' className={classes.header}>
          <div className={classes.headerCard}>
            <h1 className={classes.headerText}>Books</h1>
            <Button
              type='primary'
              size='large'
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Book
            </Button>
          </div>
        </Card>
        <div className={classes.content}>
          {isLoading && <Spin />}
          {
            books.map((book) => (
              <Card
                key={book._id}
                title={book.name}
                className={classes.card}
                variant='borderless'
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <Button
                    key='edit'
                    type='text'
                    size='small'
                    onClick={() => console.log('Edit book')}
                    icon={<EditOutlined />}
                  />,
                  <Popconfirm
                    title='Sure to delete?'
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => onDelete(book._id)}
                  >
                    <Button
                      key='delete'
                      type='text'
                      size='small'
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                ]}
              />
            ))
          }
        </div>
      </div>
      <BookModal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)} />
    </>
  )
})

export default Home