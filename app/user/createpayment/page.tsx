"use client"
import React from 'react';
import ArrowLeftIcon from '../components/ArrowLeftIcon';
import AddressForm from '../components/PaymentForm';
import TermsAndPayment from '../components/TermsAndPayment';
import { Breadcrumb, Card, Form, Input, Button, Radio, Tag, Space, Table } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import li from 'react';
const CreatePayment:React.FC = () => {

    return (
        <main className='flex flex-col space-y-4 m-3' >
            <div style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
                <nav className='ant-breadcrumb'>
                    <ol>
                        <li className='mx-2'>
                            <span className='px-1'>
                                <a href='dashboard'>แดชบอร์ด</a>
                            </span>
                            <span className='px-1'>
                               /
                            </span>
                            <span className='px-1'>
                                <a href='status'>เช็คสถานะและแจ้งส่งของ</a>
                            </span>
                            <span className='px-1'>
                               /
                            </span>
                            <span className='px-1'>
                                <a>ชำระเงินค่าขนส่งสินค้า</a>
                            </span>
                        </li>
                    </ol>
                </nav>
                <div className='flex ml-3 mt-3 gap-x-4 items-center' style={{ display: 'flex', marginLeft: '12px', marginTop: '12px' }}>
                    <ArrowLeftIcon
                        style={{ color: 'black', cursor: 'pointer', background:'transparent', padding:'0px', lineHeight: 'inherit', display:'inline-block' }}
                        onClick={() => console.log('Icon clicked')}
                    />
                    <span className = 'text-xl font-semibold' title='ชำระเงินค่าขนส่งสินค้า'> 
                        ชำระเงินค่าขนส่งสินค้า
                    </span>
                </div>
            </div>
            <div className='flex flex-row gap-5 bg-blue-100 m-3'>
                <div>
                    <AddressForm/>
                    {/* <TermsAndPayment/> */}
                </div>                
            </div>

        </main>
    );
    
};
export default CreatePayment;
