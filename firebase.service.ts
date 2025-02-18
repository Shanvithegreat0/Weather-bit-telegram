import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from '../types'; // Import User type from types.ts
import * as serviceAccount from '../../weather-bot-7c53b-firebase-adminsdk-fbsvc-06b1ad45bf.json'; // Firebase key import

@Injectable()

export class FirebaseService implements OnModuleInit {
  private db: admin.database.Database;

  constructor() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
              projectId: 'weather-bot-7c53b',
              privateKey: "\n-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsqHXpXKEBOBse\n7+odVWSwjlsCW6f6+PQJqhr+kcLiPK5/MoyajAcQ5wbC6Y6NLhVF/Q6CWdOXAMea\nxEFqyvBbuDx/NOAKqi3GlgD8tP3kFz5wJgNpkep4ue2qIJxEwM7rFsOFIAjwY7Ag\nz0vsXys/BafU8nZVrdfv/CnnJ6W5ZagcWxkYlNPjcB1KP3N2O3Bd31UBfFBnlCSB\nSZdpz2LgrvgZqCzoQ9BcLK5sgfky2mP4PZ+CRCuo7TXXGVcJmlGEFH7Xnw0U7j8f\n5UgI6MieGWCUbEfaiACIBd1ysplNXrgQ5bZy5bZuye0bHMcpJj+VgJCvx0Vzif8J\nXeyjwGujAgMBAAECggEAEUAzp8FNhOWqMAkghxXFHa7bgPzPZ8//8gdA8zZ1Fk2h\n0aunSLm86v9qOYdEau6zyW5jSLrY3TmCt//r2VO1eDSMNtl9mRMvx6utJZKf225H\nGsVxida+apmJGXpwop3xDqQTnPV6bypGqsCLgW5wz7cs8aXYFO9tp9i2BxZ7BG7t\ngV7LTjvpHokDx2L2ZVLeV0aYKGNtnioHqOLi5YdYtkbhbHsmESJwrNwQKHYOwGl5\nr8R0+DYpOMlW54TpllTl7iq+CPSNpetEwnbLZebAhAXgoT304sls8EjOWB7mW2gV\nfj7+sNrPmGaG1PWBG0WtYq5fcTJpSmmqEpAhHVpw4QKBgQDpxuqfvoBaUn/PNO/P\ngshNmCyOYc4ftPQF32cw8iPz99AU051NLHYd2xaHVSL/z5p540dTdnsoQKjah0m7\n832ZkKqYNGoW8AtQehd2+UngAwKKxLec3mp0aQA0/+wX5dQtFWagiiRI+TY3Zarf\n/XsQ62ntD8npCbYsgys3a3D0ZQKBgQC9Ei7EOCzlYBBF74P1knFFt+ZnlRACCH5t\nBd7P2pKjFAxoOYJoZt4L+6mVKjTwEIOL4+4i5BkGk3wynlKcrgUYKc8Sv+FZ0feg\nY1u9fGEy75lj15SGrL0Rwygdsygl/Hq2hbhxFjRaGTpJ0v0A8Yqg94H94AjWDDHK\nOhwLfFrLZwKBgH1kBFTKiW3o8kThz/8t1uJHzR5Rt42qMXk06tSGDGK/eQyytJzA\nTFqXOO497Bfp8qGOFqPd2REuHWOZTSNS5vuHbPlWo9DJ0EfKNOvLqqRM+QAVo6aw\nZckqyMGkw63NyJCl+fYCIpRBl6L/FTgvbeMVYiuVXGdynhQiBvwi1ONBAoGATLMF\nmcAYJmzT7Sr+4y4nGVtC8p47wjdj4iJRgwxuFA3cAqPhzSx9w2qyHrrigsiQNL2g\nKzNRG6PU7Evhw4Gsu2KqiDai2mcdB0mHO9UrMRiVpzUbIY8NnBkJOxMkpFRKC6Uv\nb2DMmAhH5w7aZ/mUfTwq1ax+qSaFRD5Shi5KPt0CgYBa6ZWqhVk3QDOebrA2s8Zg\nptevBlhcM6zu5ICF7HLjelwstIvirtlvakEfWphbhIMVsCPj8TpK3EJcwCy/GYzE\nN0ECNOdqucXT5Sx7OpQ6QbVSZPx+F+WuoBCQwRJD0xJAFFGNAL0YF7sTSFBOJ07/\nNFdK6+m4HUrEoEHEyt8TLw==\n-----END PRIVATE KEY-----\n",
              clientEmail: 'firebase-adminsdk-fbsvc@weather-bot-7c53b.iam.gserviceaccount.com',
            }),
            databaseURL: 'https://weather-bot-7c53b-default-rtdb.firebaseio.com/',
          });
    }  

    this.db = admin.database();
  }

  onModuleInit() {
    console.log('🔥 Firebase Connected!');
  }

  // ✅ Save New User to Firebase
  async saveUser(userId: string, name: string, isSubscribed: boolean): Promise<void> {
    await this.db.ref(`users/${userId}`).set({
      name,
      isSubscribed,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ User ${name} (${userId}) saved to Firebase`);
  }

  // ✅ Update Subscription Status
  async updateSubscription(userId: string, status: boolean): Promise<void> {
    await this.db.ref(`users/${userId}`).update({ isSubscribed: status });
    console.log(`🔄 Subscription updated for ${userId}: ${status}`);
  }

  // ✅ Fetch All Users
  async getAllUsers(): Promise<{ [key: string]: User }> {
    const snapshot = await this.db.ref('users').once('value');
    const users = snapshot.val() || {};  // Default to empty object if no data
    return users;
  }

  // ✅ Fetch a single user
  async getUser(userId: string): Promise<User | null> {
    const snapshot = await this.db.ref(`users/${userId}`).once('value');
    const user = snapshot.val();
    return user ? user as User : null; // Return user if found, otherwise null
  }
}
