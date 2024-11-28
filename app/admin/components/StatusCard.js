import React from 'react';
import { Card } from 'antd';
import { ShoppingOutlined, UserOutlined } from '@ant-design/icons';

const StatusCard = ({ card }) => {
  const Icon = card.title === "รหัสสมาชิก" ? UserOutlined : ShoppingOutlined;

  return (
    <Card className="_pm_cardList_1xea5_211" style={{ borderRadius: '12px', backgroundColor: card.backgroundColor }}>
      <div style={{ display: 'flex', alignItems: 'center', color: card.color }}>
        <Icon style={{ 
          color: card.backgroundColor, 
          fontSize: '50px', 
          backgroundColor: 'rgb(255, 255, 255)', 
          borderRadius: '10px',
          padding: '10px'
        }} />
        <div style={{ marginLeft: '12px' }}>
          <span>{card.title}</span>
          <p>{card.count}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatusCard;