import React from 'react';
import { Card } from 'antd';

interface CardProps {
  title: string;
  content: string | number;
}

const DataCard: React.FC<CardProps> = ({ title, content }) => (
  <Card title={title} bordered={false}>
    {content}
  </Card>
);

export default DataCard;