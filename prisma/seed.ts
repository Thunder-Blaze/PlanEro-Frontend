import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.service.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@planero.com',
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('👑 Created admin user')

  // Create Host Users
  const hostUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'HOST',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'HOST',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Michael Davis',
        email: 'michael.davis@example.com',
        role: 'HOST',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        role: 'HOST',
        emailVerified: new Date(),
      }
    })
  ])

  console.log('👥 Created host users')

  // Create Vendor Users
  const vendorUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alex Photography',
        email: 'alex@photography.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bella Catering',
        email: 'bella@catering.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Events',
        email: 'charlie@events.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Diana Florals',
        email: 'diana@florals.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Elite Entertainment',
        email: 'elite@entertainment.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    }),
    prisma.user.create({
      data: {
        name: 'Frank Venues',
        email: 'frank@venues.com',
        role: 'VENDOR',
        emailVerified: new Date(),
      }
    })
  ])

  console.log('🏪 Created vendor users')

  // Create Vendor Profiles
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        businessName: 'Alex Photography Studio',
        location: 'New York, NY',
        pincode: '10001',
        bio: 'Professional wedding and event photography with over 10 years of experience. Specializing in candid moments and artistic portraits.',
        websiteUrl: 'https://alexphotography.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
        userId: vendorUsers[0].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'MODERATE'
      }
    }),
    prisma.vendor.create({
      data: {
        businessName: 'Bella\'s Gourmet Catering',
        location: 'Los Angeles, CA',
        pincode: '90210',
        bio: 'Exquisite catering services for weddings, corporate events, and special occasions. Farm-to-table ingredients and customizable menus.',
        websiteUrl: 'https://bellacatering.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        userId: vendorUsers[1].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'LUXURY'
      }
    }),
    prisma.vendor.create({
      data: {
        businessName: 'Charlie\'s Event Planning',
        location: 'Chicago, IL',
        pincode: '60601',
        bio: 'Full-service event planning and coordination. From intimate gatherings to large-scale corporate events, we handle every detail.',
        websiteUrl: 'https://charlieevents.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop',
        userId: vendorUsers[2].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'AFFORDABLE'
      }
    }),
    prisma.vendor.create({
      data: {
        businessName: 'Diana\'s Floral Designs',
        location: 'Miami, FL',
        pincode: '33101',
        bio: 'Beautiful floral arrangements and decorations for all occasions. Fresh flowers sourced daily from local growers.',
        websiteUrl: 'https://dianaflorals.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        userId: vendorUsers[3].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'MODERATE'
      }
    }),
    prisma.vendor.create({
      data: {
        businessName: 'Elite Entertainment Group',
        location: 'Las Vegas, NV',
        pincode: '89101',
        bio: 'Premium entertainment services including DJs, live bands, and performance artists for weddings and corporate events.',
        websiteUrl: 'https://eliteentertainment.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        userId: vendorUsers[4].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'LUXURY'
      }
    }),
    prisma.vendor.create({
      data: {
        businessName: 'Frank\'s Premier Venues',
        location: 'Austin, TX',
        pincode: '78701',
        bio: 'Stunning venue rentals for weddings, corporate events, and private parties. Historic and modern spaces available.',
        websiteUrl: 'https://frankvenues.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop',
        userId: vendorUsers[5].id,
        isApproved: true,
        isPublished: true,
        expenseLevel: 'MODERATE'
      }
    })
  ])

  console.log('🏢 Created vendor profiles')

  // Create Services
  const services = await Promise.all([
    // Alex Photography Services
    prisma.service.create({
      data: {
        name: 'Wedding Photography Package',
        vendorId: vendors[0].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          duration: '8 hours',
          deliverables: ['300+ edited photos', 'Online gallery', 'Print release'],
          equipment: ['Professional DSLR', 'Lighting equipment', 'Backup cameras']
        },
        cost: 2500.00,
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop'
        ]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Corporate Event Photography',
        vendorId: vendors[0].id,
        eventType: 'CORPORATE',
        available: true,
        metadata: {
          duration: '4 hours',
          deliverables: ['100+ edited photos', 'Same-day preview', 'Professional headshots'],
          setup: 'Minimal disruption to event flow'
        },
        cost: 1200.00,
        images: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop'
        ]
      }
    }),

    // Bella Catering Services
    prisma.service.create({
      data: {
        name: 'Luxury Wedding Catering',
        vendorId: vendors[1].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          guestCount: 'Up to 200 guests',
          courses: '5-course plated dinner',
          dietary: 'Vegetarian, vegan, gluten-free options',
          service: 'Full waitstaff included'
        },
        cost: 8500.00,
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop'
        ]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Corporate Lunch Catering',
        vendorId: vendors[1].id,
        eventType: 'CORPORATE',
        available: true,
        metadata: {
          guestCount: 'Up to 50 guests',
          style: 'Buffet or boxed lunches',
          setup: 'Complete setup and cleanup',
          notice: '24-hour advance booking required'
        },
        cost: 1800.00,
        images: [
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop'
        ]
      }
    }),

    // Charlie Events Services
    prisma.service.create({
      data: {
        name: 'Full Wedding Planning',
        vendorId: vendors[2].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          timeline: '12 months planning period',
          includes: ['Vendor coordination', 'Timeline management', 'Day-of coordination'],
          meetings: 'Monthly planning meetings',
          support: '24/7 support during planning'
        },
        cost: 4500.00,
        images: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop'
        ]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Birthday Party Planning',
        vendorId: vendors[2].id,
        eventType: 'BIRTHDAY',
        available: true,
        metadata: {
          ageGroups: 'Children and adult parties',
          includes: ['Theme design', 'Vendor coordination', 'Setup and cleanup'],
          duration: '4-hour event management'
        },
        cost: 800.00,
        images: [
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop'
        ]
      }
    }),

    // Diana Florals Services
    prisma.service.create({
      data: {
        name: 'Wedding Floral Package',
        vendorId: vendors[3].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          includes: ['Bridal bouquet', 'Bridesmaids bouquets', 'Centerpieces', 'Ceremony arch'],
          flowers: 'Seasonal and imported flowers available',
          consultation: 'Free initial consultation'
        },
        cost: 3200.00,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=600&h=400&fit=crop'
        ]
      }
    }),

    // Elite Entertainment Services
    prisma.service.create({
      data: {
        name: 'Wedding DJ Package',
        vendorId: vendors[4].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          duration: '6 hours',
          equipment: ['Professional sound system', 'Wireless microphones', 'LED lighting'],
          includes: ['Music for ceremony and reception', 'MC services', 'First dance coordination']
        },
        cost: 1800.00,
        images: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'
        ]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Corporate Event Entertainment',
        vendorId: vendors[4].id,
        eventType: 'CORPORATE',
        available: true,
        metadata: {
          options: ['Live band', 'DJ', 'Jazz ensemble'],
          duration: '3-4 hours',
          equipment: 'Professional audio/visual setup included'
        },
        cost: 2200.00,
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop'
        ]
      }
    }),

    // Frank Venues Services
    prisma.service.create({
      data: {
        name: 'Historic Ballroom Rental',
        vendorId: vendors[5].id,
        eventType: 'WEDDING',
        available: true,
        metadata: {
          capacity: 'Up to 300 guests',
          includes: ['Tables and chairs', 'Basic lighting', 'Bridal suite'],
          catering: 'Preferred caterer list available',
          parking: '100 parking spaces included'
        },
        cost: 5500.00,
        images: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=600&h=400&fit=crop'
        ]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Modern Conference Center',
        vendorId: vendors[5].id,
        eventType: 'CORPORATE',
        available: true,
        metadata: {
          capacity: 'Up to 150 guests',
          technology: ['Projectors', 'Sound system', 'Video conferencing'],
          catering: 'Full kitchen facilities available',
          amenities: ['WiFi', 'Breakout rooms', 'Reception area']
        },
        cost: 2800.00,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'
        ]
      }
    })
  ])

  console.log('🎪 Created services')

  console.log('✅ Database seeding completed successfully!')
  console.log(`
  Created:
  - 1 Admin user (admin@planero.com)
  - 4 Host users
  - 6 Vendor users with business profiles
  - 12 Services across different event types

  You can now test the application with these accounts!
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
