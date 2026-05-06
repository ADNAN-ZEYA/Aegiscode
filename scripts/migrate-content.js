const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load environment variables manually for the script
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      process.env[key] = val;
    }
  });
}

if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('Missing FIREBASE_ADMIN credentials in .env.local');
  process.exit(1);
}

// Format the private key
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

async function migrateCollection(sourceCollection, typeValue) {
  console.log(`Migrating ${sourceCollection} to 'content' collection...`);
  const snapshot = await db.collection(sourceCollection).get();
  
  if (snapshot.empty) {
    console.log(`No documents found in ${sourceCollection}.`);
    return;
  }

  const batch = db.batch();
  let count = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    const newDocRef = db.collection('content').doc(doc.id);
    
    batch.set(newDocRef, {
      ...data,
      type: typeValue
    }, { merge: true });
    
    count++;
  });

  await batch.commit();
  console.log(`Successfully migrated ${count} documents from ${sourceCollection} to 'content'.`);
}

async function runMigration() {
  try {
    await migrateCollection('blogs', 'blog');
    await migrateCollection('studyMaterials', 'studyMaterial');
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
