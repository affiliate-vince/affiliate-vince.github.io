// ══════════════════════════════════════════════════════════════
// 品牌数据文件 — 可手动编辑
// 字段说明：
//   slug        : URL slug，唯一标识
//   brand       : 品牌显示名称
//   category    : 粗分类（与侧边栏页签对应）
//   description : 品牌描述
//   favicon     : Logo 图片 URL（null = 无 Logo，显示首字母），Amazon页面中<a title="brand-logo">的<img>子标签src属性
//   bg          : Banner 背景图 URL（null = 使用 gradient），Amazon页面中<div data-testid="hero-image">的<img>子标签src属性
//   gradient    : 无 bg 时的 CSS 背景渐变
//
// ══════════════════════════════════════════════════════════════
const BRANDS = [
  { 
    slug:"aurzen",
    brand:"Aurzen",       
    category:"Electronics",      
    description:"Smart projectors, Roku TVs, Eazze & Boom portable projectors",  
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/aplus-media-library-service-media/49a2e018-e229-4997-98e7-defcddf0e30c.__CR0,0,2928,1250_PT0_SX1464_V1___.jpg",  
    gradient:"linear-gradient(135deg,#0a0a2a 0%,#06061a 100%)" 
  },
  { 
    slug:"brondell",
    brand:"Brondell",       
    category:"Home & Living",      
    description:"Premium bidets, toilet seats and bathroom accessories",  
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/4d9fe11c-65ac-44a2-bd2c-1b02d23bc9ab._CR0%2C0%2C3000%2C600_SX1500_.png",  
    gradient:"linear-gradient(135deg,#1a2a3a 0%,#0f1a20 100%)" 
  },
  { 
    slug:"cute-stone",  
    brand:"CUTE STONE",   
    category:"Baby & Kids",     
    description:"Kids toys, play sets, educational games and building blocks",       
    favicon:"https://m.media-amazon.com/images/S/abs-image-upload-na/9/AmazonStores/ATVPDKIKX0DER/d130fb992154923b4b844a8ded370266.w398.h248._CR0%2C0%2C398%2C248_SX100_.png",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/43e65b8a-b15c-4f0f-9a29-1e6d8895bd08.jpg", 
    gradient:"linear-gradient(135deg,#2a1a0a 0%,#1a1008 100%)" 
  },
  { 
    slug:"fitpolo",
    brand:"Fitpolo",       
    category:"Beauty & Care",      
    description:"Fitness trackers, smartwatches and health monitoring devices",  
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/4be6297f-e628-42f1-9caf-519f85ddbd6a._CR0%2C0%2C3000%2C600_SX1500_.png",  
    gradient:"linear-gradient(135deg,#0a2a1a 0%,#051a10 100%)" 
  },
  { 
    slug:"gys",         
    brand:"GYS",          
    category:"Fashion",         
    description:"Bamboo viscose sleepwear, pajamas and loungewear for women and men",  
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/55df7d1c-0eb4-4add-a068-16b1bf76aa33._CR0%2C0%2C420%2C400_SX100_.jpg", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/1078e418-66d1-449c-945e-42939f229c80._CR0%2C0%2C3000%2C600_SX1500_.gif", 
    gradient:"linear-gradient(135deg,#1a2a1a 0%,#0f1a0f 100%)" 
  },
  { 
    slug:"hoto",
    brand:"HOTO Tools",       
    category:"Home & Living",      
    description:"Professional hand tools, power tool accessories and DIY equipment",  
    favicon:"https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/9/AmazonStores/ATVPDKIKX0DER/20358d113f9fbdb34e31c097982aaefa.w920.h920._CR0%2C0%2C920%2C920_SX100_.jpg",                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/41ec95a7-1bbc-40f6-b82b-c3bdfc34718d._CR0%2C1%2C3000%2C600_SX1500_.png",  
    gradient:"linear-gradient(135deg,#2a1a0a 0%,#1a1008 100%)" 
  },
  { 
    slug:"grownsy",     
    brand:"GROWNSY",      
    category:"Beauty & Care",   
    description:"Baby feeding kits, care sets, bottle warmers and parenting tools",    
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/fcd3ccf5-daa9-4430-8fed-bf32b9ca8f4a._CR0%2C0%2C600%2C600_SX100_.png", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/739120ca-aa06-446f-9fa0-4fdab2b96d48._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#1a2a1a 0%,#0f1a0f 100%)" 
  },
  { 
    slug:"allswifit",   
    brand:"ALLSWIFIT Sports", 
    category:"Sports & Outdoors", 
    description:"Athletic footwear, running shoes, slip-ons and active lifestyle shoes", 
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/7c7f253d-3f93-4bc8-aeb2-fca43fd9d7e4._CR0%2C0%2C400%2C400_SX100_.jpg", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/2fccbc3b-e91f-4e05-8ddc-e5be6dedd304._CR0%2C0%2C4500%2C900_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#2d1a3a 0%,#1f1228 100%)" 
  },
  { 
    slug:"happrun",     
    brand:"HAPPRUN",      
    category:"Electronics",     
    description:"Smart projectors, Google TV, home theater and Netflix series",        
    favicon:"https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/2/AmazonStores/ATVPDKIKX0DER/6c8e15a68853fbc22f59aa617496eda4.w400.h400._CR0%2C0%2C400%2C400_SX100_.jpg", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/810be0cd-67cd-4387-907a-d1107621d690._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#0a1a2a 0%,#050f1a 100%)" 
  },
  { 
    slug:"hittiona",    
    brand:"HITTIONA",     
    category:"Beauty & Care",   
    description:"Hair dryers, stylers, ionic beauty tools and home fitness gear",      
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/d6372bfc-90f0-4947-8c2d-e85e794fb5ad._CR0%2C0%2C867%2C867_SX100_.png",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/e31cdde7-be34-47a2-a5f8-4528630189a7.jpg", 
    gradient:"linear-gradient(135deg,#2a1020 0%,#1a0815 100%)" 
  },
  { 
    slug:"horow",       
    brand:"HOROW",        
    category:"Home & Living",   
    description:"Smart toilets, vanities, bathroom fixtures and modern home essentials",
    favicon:"https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/0/AmazonStores/ATVPDKIKX0DER/0885bfa0d2a0da11838b4fe8d7d534fb.w1500.h1500._CR0%2C0%2C1500%2C1500_SX100_.jpg",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/c442ad67-1d07-4e42-ab61-4c34cf10cd7f.jpg", 
    gradient:"linear-gradient(135deg,#1a1a2f 0%,#0f0f1f 100%)" 
  },
  { 
    slug:"aiper",       
    brand:"AIPER",        
    category:"Home & Living",   
    description:"Pool robots, cordless vacuums and smart cleaning devices",            
    favicon:"https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/2/AmazonStores/ATVPDKIKX0DER/56c8d362c7389ded31574766c90bf2c7.w400.h400._CR0%2C0%2C400%2C400_SX100_.jpg",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/3b1f2888-3f4c-461b-9878-3ff799375379.jpg", 
    gradient:"linear-gradient(135deg,#0a2a3a 0%,#061820 100%)" 
  },
  { 
    slug:"imarku",      
    brand:"imarku",       
    category:"Kitchen",         
    description:"Chef knives, cookware, kitchen tools and professional-grade utensils", 
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/69ca4512-7eea-44b2-a9bc-a94d087d28be._CR0%2C0%2C600%2C600_SX100_.png",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/294676d0-c9b3-472c-92f5-c3779c16e4b0.jpg", 
    gradient:"linear-gradient(135deg,#2a0a0a 0%,#1a0505 100%)" 
  },
  { 
    slug:"it-cosmetics",
    brand:"IT Cosmetics", 
    category:"Beauty & Care",    
    description:"Makeup and skincare powered by skin-care science and dermatology",      
    favicon:null,
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/f1d813b8-36fe-4220-b379-8f337bb2885f._CR0%2C0%2C1500%2C300_SX1500_.jpg",
    gradient:"linear-gradient(135deg,#3a1a2a 0%,#2a1020 100%)"
  },
  {
    slug:"jmoon",
    brand:"JMOON Beauty Device",
    category:"Beauty & Care",
    description:"At JMOON, we believe that beauty is not just about looking good—it's about experiencing something extraordinary. Born to Perform. Made to Transform. These words encapsulate our commitment to bringing the highest level of performance and sophistication to your skincare routine. With JMOON, luxury is redefined, and everyday beauty transforms into a truly exceptional experience.",
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/b653b09e-fc98-4eee-a615-8bf23c82ac97._CR0%2C0%2C1000%2C1000_SX100_.jpg",
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/b823622d-e135-4b1c-83e4-0b27b691f254._CR0%2C0%2C3000%2C600_SX1500_.jpg",
    gradient:"linear-gradient(135deg,#3a1a3a 0%,#2a102a 100%)"
  },
  { 
    slug:"lahome",
    brand:"Lahome",       
    category:"Home & Living",      
    description:"Area rugs, home decor and decorative textiles",  
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/fb3082ee-4119-401d-869e-df1583e18780._CR0%2C0%2C400%2C400_SX100_.jpg",                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/5726a892-6543-4333-bd0b-99370121a4a0._CR0%2C0%2C2268%2C446_SX1500_.jpg",  
    gradient:"linear-gradient(135deg,#1a1a2a 0%,#0f0f1a 100%)" 
  },
  { 
    slug:"livebox",     
    brand:"LIVEBOX",      
    category:"Home & Living",   
    description:"Area rugs, carpets, living room textiles and home furnishings",        
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/063eaa5a-4e7c-4182-b173-f0944e750467._CR0%2C0%2C1771%2C1771_SX100_.png", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/ab4db008-e0e0-4321-8498-805355c5483b._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#0a1a0a 0%,#051005 100%)" 
  },
  { 
    slug:"maono",       
    brand:"MAONO",        
    category:"Electronics",     
    description:"Microphones, audio interfaces, mixers for content creators",           
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/69fc836e-b6a4-4915-abc5-11a352a30d31._CR0%2C0%2C3000%2C600_SX1500_.jpg",  
    gradient:"linear-gradient(135deg,#1a1a2a 0%,#0f0f1a 100%)" 
  },
  { 
    slug:"mescomb",     
    brand:"MESCOMB",      
    category:"Beauty & Care",   
    description:"Hot air stylers, curling irons, hair dryers and ionic hair tools",     
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/33943581-0942-4754-9c4d-61df5b866afd._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#2a1a2a 0%,#1a101a 100%)" 
  },
  { 
    slug:"nelko",
    brand:"NELKO",       
    category:"Beauty & Care",      
    description:"Hair styling tools, hair dryers and beauty accessories",  
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/8a6bcda1-828f-4b51-b352-1bd6de1b80e0._CR0%2C0%2C400%2C400_SX100_.jpg",                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/d61ad24d-540f-4f89-8a76-934406b20c6e._CR0%2C0%2C3000%2C600_SX1500_.jpg",  
    gradient:"linear-gradient(135deg,#2a1a2a 0%,#1a1015 100%)" 
  },
  { 
    slug:"obsbot",
    brand:"OBSBOT",       
    category:"Electronics",      
    description:"AI-powered PTZ cameras, streaming webcams and video production equipment",  
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/63b57ebd-291b-461f-8f03-f2040cf01376._CR0%2C0%2C1000%2C1000_SX100_.png",                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/ebe120da-e800-473c-b8e5-19a4aba8db04._CR0%2C0%2C3000%2C600_SX1500_.png",  
    gradient:"linear-gradient(135deg,#0a1a2a 0%,#050f1a 100%)" 
  },
  { 
    slug:"olight",      
    brand:"OLIGHT",       
    category:"Home & Living",   
    description:"EDC flashlights, headlamps, weapon lights and outdoor illumination",   
    favicon:"https://m.media-amazon.com/images/S/abs-image-upload-na/f/AmazonStores/ATVPDKIKX0DER/eb846883fe013132cff813d189930ed9.w600.h600._CR0%2C0%2C600%2C600_SX100_.jpg", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/722c934e-d453-4a1f-bc9b-564320af0eef._SL5000_CR0%2C0%2C5000%2C1000_SX1500_.png", 
    gradient:"linear-gradient(135deg,#2a1a0a 0%,#1a1008 100%)" 
  },
  { 
    slug:"plaud",       
    brand:"Plaud",        
    category:"Electronics",     
    description:"AI voice recorders with GPT-powered transcription and summarization",  
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/3ef5efdb-5f98-41be-9dd5-d8f6a01ca7b1._CR0%2C0%2C400%2C400_SX100_.png", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/d90a4993-2634-4217-9d63-fe428cf76a06._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#1a0a2f 0%,#100620 100%)" 
  },
  { 
    slug:"prudiut",     
    brand:"Prudiut",      
    category:"Home & Living",   
    description:"Watercolor paper, craft supplies, kitchen tools and accessories",      
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/7ecd732d-6e38-466d-9bf9-551592cbdb77._CR0%2C0%2C1200%2C1200_SX100_.jpg",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/0bc98899-aaf2-48a9-815f-b38145bc5712._CR0%2C0%2C3000%2C600_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#1a1a0a 0%,#0f0f08 100%)" 
  },
  { 
    slug:"renpho",      
    brand:"RENPHO",       
    category:"Beauty & Care",   
    description:"Fitness trackers, massage guns, smart scales and health monitors",     
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/02ecd33d-cfaf-421e-a525-af7e00db51c1._CR0,0,400,400_SX100_.jpg", 
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/035d5a62-b3ae-4cf4-82a0-d92d880ade4d._CR0%2C0%2C1500%2C300_SX1500_.png", 
    gradient:"linear-gradient(135deg,#0d2f2f 0%,#0f1f1f 100%)" 
  },
  { 
    slug:"reolink",     
    brand:"REOLINK",      
    category:"Electronics",     
    description:"Security cameras, doorbells, battery-powered cams and NVR systems",    
    favicon:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/e12f7aa6-c3e8-4959-9f03-bdd3e43a42f7._CR0%2C0%2C800%2C800_SX100_.png",                          
    bg:"https://m.media-amazon.com/images/S/aplus-media-library-service-media/3b6263ea-52bc-4c44-8cf7-3278b1b15b1f.__CR0,0,1464,625_PT0_SX1464_V1___.jpg", 
    gradient:"linear-gradient(135deg,#0a1f3f 0%,#0f1f2f 100%)" 
  },
  { 
    slug:"running-girl",
    brand:"RUNNING GIRL", 
    category:"Sports & Outdoors",
    description:"Athletic wear and sports apparel designed for active women",            
    favicon:"https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/7/AmazonStores/ATVPDKIKX0DER/fc5b533546fbc23137897086cd7665e9.w400.h400._CR0%2C0%2C400%2C400_SX100_.jpg",  
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cdb61fab-2e74-460c-97ae-3c998f739c6c.jpg", 
    gradient:"linear-gradient(135deg,#2a0f0a 0%,#1a0806 100%)" 
  },
  { 
    slug:"yitamotor",   
    brand:"YITAMOTOR",    
    category:"Automotive",      
    description:"Floor mats, running boards, LED light bars and truck accessories",     
    favicon:null,                          
    bg:"https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/354c1db0-781e-4c6f-b63c-858bd2659744._CR0%2C0%2C1920%2C384_SX1500_.jpg", 
    gradient:"linear-gradient(135deg,#1f1a0a 0%,#15120a 100%)" 
  },
];
