'use client'
import Card from 'antd/lib/card';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Typography from 'antd/lib/typography';
import Space from 'antd/lib/space';
import { useRouter } from 'next/navigation'

const { Meta } = Card;
const { Text } = Typography;

const NoticeCard = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('./announcementdetail');
    };

    return (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={12} md={8} xl={6}>
                <a onClick={handleClick}>
                    <Card
                        hoverable
                        style={{ marginTop: 15 }}
                        cover={<img alt="" src="/path-to-your-image.jpg" />}
                    >
                        <Meta
                            title={
                                <Space direction="vertical" size={8}>
                                    <Text>09/05/2023</Text>
                                    <a onClick={(e) => { e.preventDefault(); handleClick(); }}>ประกาศแจ้งสินค้าไม่มีเจ้าของ</a>
                                </Space>
                            }
                            description="ประกาศแจ้งสินค้าไม่มีเจ้าของ 💛😊แจ้งลูกค้าทุกๆท่าน สำหรับท่านใดที่สั่งสินค้าเข้ามาแล้ว สินค้าไม่เข้าระบบ หรือทางร้านค้าระบุชื่อไม่ครบ ไม่ชัดเจน ส่งผลให้สินค้าของท่านไม่เข้าระบบ"
                        />
                    </Card>
                </a>
            </Col>
        </Row>
    );
};

export default NoticeCard;
