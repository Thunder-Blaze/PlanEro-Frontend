// Test file to verify API integration
import { authApi, vendorApi, checkApiHealth } from './lib/api-new'

async function testApiIntegration() {
  console.log('🔍 Testing API Integration...')
  
  // Test API health
  const isHealthy = await checkApiHealth()
  console.log(`API Health Check: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`)
  
  if (!isHealthy) {
    console.log('❌ API is not responding. Check the external API server.')
    return
  }
  
  try {
    // Test vendor endpoints (no auth required)
    console.log('\n📦 Testing Vendor Endpoints...')
    const vendors = await vendorApi.getAllVendors()
    console.log(`✅ Fetched ${vendors.length} vendors`)
    
    if (vendors.length > 0) {
      const firstVendor = await vendorApi.getVendorById(vendors[0].id)
      console.log(`✅ Fetched vendor details for ID ${firstVendor.id}`)
    }
    
  } catch (error) {
    console.error('❌ Vendor API test failed:', error)
  }
  
  console.log('\n🎉 API Integration Test Complete!')
}

export { testApiIntegration }
