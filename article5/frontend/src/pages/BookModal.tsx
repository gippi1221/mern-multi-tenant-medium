import { useBookStore } from '@/hooks';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { observer } from 'mobx-react-lite';

type Props = {
  isOpen: boolean;
  onModalClose: () => void;
};

const BookModal = observer(({ isOpen, onModalClose }: Props) => {
  const { addBook } = useBookStore();
  const [form] = Form.useForm();

  const onClose = () => {
    form.resetFields();
    onModalClose();
  };

  const onFinish = async (values: any) => {
    await addBook(values);
    onClose();
  };

  return (
    <Modal
      title="Add new book"
      footer={[
        <Button key="cancel" onClick={onClose} type="text">
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="book-form" icon={<SaveOutlined />}>
          Submit
        </Button>,
      ]}
      open={isOpen}
      onCancel={onClose}
      onClose={onClose}
    >
      <Form layout="vertical" requiredMark="optional" onFinish={onFinish} form={form} id="book-form">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter book name" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default BookModal;
