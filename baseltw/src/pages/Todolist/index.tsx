import { Button, Form, Input, Modal, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface TodoItem {
    id: string;
    task: string;
    description?: string;
}

const { confirm } = Modal;

const Todolist = () => {
    const [data, setData] = useState<TodoItem[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [row, setRow] = useState<TodoItem>();

    // Thêm mảng các màu để luân phiên sử dụng cho các card
    const borderColors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        getTodoList();
    }, []);

    const getTodoList = () => {
        const todoData = localStorage.getItem('todolist');
        if (todoData) {
            setData(JSON.parse(todoData));
        }
    };

    const showDeleteConfirm = (item: TodoItem) => {
        confirm({
            title: 'Are you sure you want to delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: `Task: ${item.task}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const todoData = JSON.parse(localStorage.getItem('todolist') || '[]');
                const newData = todoData.filter((todo: TodoItem) => todo.id !== item.id);
                localStorage.setItem('todolist', JSON.stringify(newData));
                getTodoList();
            },
        });
    };

    return (
        <div style={{ padding: '24px', background: '#f3f4f6' }}>
            <h1 style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                fontSize: '32px',
                fontWeight: 'bold'
            }}>
                Todo List
            </h1>
            
            <div style={{ 
                width: '100%',
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '32px'
            }}>
                <Button
                    type="primary"
                    onClick={() => {
                        setVisible(true);
                        setIsEdit(false);
                    }}
                    style={{ 
                        height: '40px',
                        padding: '0 32px',
                        borderRadius: '20px',
                        fontSize: '16px',
                        background: '#6366f1',
                        border: 'none'
                    }}
                >
                    Create Task
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {data.map((item, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card
                            bordered={false}
                            style={{ 
                                marginBottom: '16px',
                                background: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                borderTop: `3px solid ${borderColors[index % borderColors.length]}`,
                            }}
                            bodyStyle={{
                                padding: '20px',
                                background: '#fff',
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '14px',
                                color: borderColors[index % borderColors.length],
                                background: `${borderColors[index % borderColors.length]}15`,
                                marginBottom: '12px'
                            }}>
                                {item.task}
                            </div>
                            <p style={{ 
                                minHeight: '60px',
                                marginBottom: '30px',
                                color: '#6b7280'
                            }}>
                                {item.description || 'No description'}
                            </p>
                            <div style={{ 
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <EditOutlined 
                                    onClick={() => {
                                        setVisible(true);
                                        setRow(item);
                                        setIsEdit(true);
                                    }}
                                    style={{ 
                                        fontSize: '16px',
                                        color: borderColors[index % borderColors.length],
                                        cursor: 'pointer'
                                    }}
                                />
                                <DeleteOutlined 
                                    onClick={() => showDeleteConfirm(item)}
                                    style={{ 
                                        fontSize: '16px',
                                        color: '#ef4444',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                destroyOnClose
                footer={false}
                title={isEdit ? 'Edit Task' : 'Create New Task'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setRow(undefined);
                }}
            >
                <Form
                    preserve={false}
                    onFinish={(values) => {
                        if (isEdit && row) {
                            const todoData = JSON.parse(localStorage.getItem('todolist') || '[]');
                            const index = todoData.findIndex((item: TodoItem) => item.id === row.id);
                            const updatedItem = { ...values, id: row.id };
                            todoData.splice(index, 1, updatedItem);
                            localStorage.setItem('todolist', JSON.stringify(todoData));
                        } else {
                            const newItem = {
                                ...values,
                                id: Date.now().toString(),
                            };
                            const todoData = JSON.parse(localStorage.getItem('todolist') || '[]');
                            localStorage.setItem('todolist', JSON.stringify([newItem, ...todoData]));
                        }
                        setVisible(false);
                        setRow(undefined);
                        getTodoList();
                    }}
                >
                    <Form.Item
                        label='Task'
                        name='task'
                        rules={[{ required: true, message: 'Please input task name!' }]}
                    >
                        <Input placeholder="Enter task name" />
                    </Form.Item>
                    <Form.Item
                        label='Description'
                        name='description'
                    >
                        <Input.TextArea placeholder="Enter task description" />
                    </Form.Item>
                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Button htmlType='submit' type='primary'>
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                        <Button 
                            onClick={() => {
                                setVisible(false);
                                setRow(undefined);
                            }} 
                            style={{ marginLeft: 8 }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Todolist;