import React, {useState} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {Avatar, Badge, Page, Thumbnail, DisplayText, CalloutCard, Card, EmptyState, Layout, Link as PLink} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';

export default function Home() { 
  const router = useRouter()

  function clickedStart(){
    router.push('/create');
  }

  return (
    <Page> 
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        <Layout.Section>
           <EmptyState
            heading="Create a sale banner for a product"
            action={{content: 'Start', onAction: ()=> clickedStart()}}
            secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p> Get More Sales with this banner.</p>
          </EmptyState>
        </Layout.Section>
        
     </Layout>
    
  </Page>
  )
}
