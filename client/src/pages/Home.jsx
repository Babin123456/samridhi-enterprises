import React from 'react'
import BannerProduct from '../extras/BannerProduct'
import BrandList from '../components/BrandList'
import CategoryRows from './products/CategoryRows'
import SEO from '../components/SEO'

const Home = () => {
  return (
    <div className='mt-20 sm:mt-24 lg:mt-32'>
      <SEO title="Home" />
      <BannerProduct/>
      <BrandList />
      <CategoryRows />
    </div>
  )
}

export default Home