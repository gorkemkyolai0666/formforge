import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123456', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@formforge.com.tr' },
    update: {},
    create: {
      email: 'demo@formforge.com.tr',
      password: hashedPassword,
      name: 'Elif Yılmaz',
      plan: 'PRO',
      aiCredits: 50,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      plan: 'PRO',
      credits: 50,
      maxForms: 100,
      maxResponses: 10000,
      billingCycle: 'monthly',
    },
  });

  const form1 = await prisma.form.upsert({
    where: { id: 'seed-form-musteri-memnuniyet' },
    update: {},
    create: {
      id: 'seed-form-musteri-memnuniyet',
      userId: demoUser.id,
      title: 'Müşteri Memnuniyet Anketi',
      description: 'Ürün ve hizmetlerimiz hakkında değerli geri bildirimlerinizi bekliyoruz.',
      status: 'PUBLISHED',
      themeColor: '#FF6B4A',
      bgColor: '#F8F9FC',
      thankYouTitle: 'Teşekkürler!',
      thankYouMsg: 'Değerli geri bildiriminiz için teşekkür ederiz. Yanıtınız kaydedildi.',
      responseCount: 47,
      viewCount: 215,
    },
  });

  const field1 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 0 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'SHORT_TEXT',
      label: 'Adınız ve Soyadınız',
      placeholder: 'Adınızı giriniz',
      required: true,
      order: 0,
    },
  });

  const field2 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 1 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'EMAIL',
      label: 'E-posta Adresiniz',
      placeholder: 'ornek@email.com',
      required: true,
      order: 1,
    },
  });

  const field3 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 2 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'NPS',
      label: 'Hizmetimizi arkadaşlarınıza tavsiye eder misiniz?',
      description: '0 (Kesinlikle tavsiye etmem) - 10 (Kesinlikle tavsiye ederim)',
      required: true,
      order: 2,
    },
  });

  const field4 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 3 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'SINGLE_CHOICE',
      label: 'Hangi hizmetimizi kullanıyorsunuz?',
      required: true,
      options: ['Web Uygulama', 'Mobil Uygulama', 'API Servisi', 'Danışmanlık'],
      order: 3,
    },
  });

  const field5 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 4 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'RATING',
      label: 'Genel memnuniyet puanınız',
      description: 'Hizmetlerimizi 1-5 arası puanlayın',
      required: true,
      order: 4,
    },
  });

  const field6 = await prisma.field.upsert({
    where: { formId_order: { formId: form1.id, order: 5 } },
    update: {},
    create: {
      formId: form1.id,
      type: 'LONG_TEXT',
      label: 'Eklemek istediğiniz bir şey var mı?',
      placeholder: 'Düşüncelerinizi paylaşın...',
      required: false,
      order: 5,
    },
  });

  const form2 = await prisma.form.upsert({
    where: { id: 'seed-form-etkinlik-kayit' },
    update: {},
    create: {
      id: 'seed-form-etkinlik-kayit',
      userId: demoUser.id,
      title: 'Teknoloji Konferansı Kayıt Formu',
      description: '2026 İstanbul Teknoloji Zirvesi\'ne kayıt olmak için formu doldurun.',
      status: 'PUBLISHED',
      themeColor: '#6366F1',
      bgColor: '#F8F9FC',
      thankYouTitle: 'Kayıt Başarılı!',
      thankYouMsg: 'Etkinliğe kaydınız alındı. Detayları e-posta adresinize gönderdik.',
      responseCount: 128,
      viewCount: 890,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form2.id, order: 0 } },
    update: {},
    create: {
      formId: form2.id,
      type: 'SHORT_TEXT',
      label: 'Ad Soyad',
      required: true,
      order: 0,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form2.id, order: 1 } },
    update: {},
    create: {
      formId: form2.id,
      type: 'EMAIL',
      label: 'İş E-postası',
      required: true,
      order: 1,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form2.id, order: 2 } },
    update: {},
    create: {
      formId: form2.id,
      type: 'SHORT_TEXT',
      label: 'Şirket Adı',
      required: true,
      order: 2,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form2.id, order: 3 } },
    update: {},
    create: {
      formId: form2.id,
      type: 'DROPDOWN',
      label: 'Pozisyonunuz',
      required: true,
      options: ['CEO/Kurucu', 'CTO', 'Yazılım Geliştirici', 'Proje Yöneticisi', 'Tasarımcı', 'Diğer'],
      order: 3,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form2.id, order: 4 } },
    update: {},
    create: {
      formId: form2.id,
      type: 'MULTIPLE_CHOICE',
      label: 'İlgilendiğiniz konular',
      options: ['Yapay Zeka', 'Bulut Bilişim', 'Siber Güvenlik', 'Web3', 'DevOps', 'UI/UX Tasarım'],
      order: 4,
    },
  });

  const form3 = await prisma.form.upsert({
    where: { id: 'seed-form-calisan-geri-bildirim' },
    update: {},
    create: {
      id: 'seed-form-calisan-geri-bildirim',
      userId: demoUser.id,
      title: 'Çalışan Geri Bildirim Formu',
      description: 'Anonim çalışan memnuniyet ve geri bildirim anketi.',
      status: 'DRAFT',
      themeColor: '#10B981',
      bgColor: '#F0FDF4',
      responseCount: 0,
      viewCount: 0,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form3.id, order: 0 } },
    update: {},
    create: {
      formId: form3.id,
      type: 'LIKERT',
      label: 'İş yerindeki genel memnuniyetiniz',
      options: ['Çok Memnunum', 'Memnunum', 'Kararsızım', 'Memnun Değilim', 'Çok Memnun Değilim'],
      required: true,
      order: 0,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form3.id, order: 1 } },
    update: {},
    create: {
      formId: form3.id,
      type: 'RATING',
      label: 'Yöneticinizin performansını değerlendirin',
      required: true,
      order: 1,
    },
  });

  await prisma.field.upsert({
    where: { formId_order: { formId: form3.id, order: 2 } },
    update: {},
    create: {
      formId: form3.id,
      type: 'LONG_TEXT',
      label: 'İyileştirilmesini istediğiniz konular',
      placeholder: 'Önerilerinizi paylaşın...',
      required: false,
      order: 2,
    },
  });

  const responses = [
    { email: 'ahmet@firma.com', name: 'Ahmet Demir', fields: [field1, field2, field3, field4, field5, field6] },
    { email: 'zeynep@tech.com', name: 'Zeynep Kaya', fields: [field1, field2, field3, field4, field5] },
    { email: 'mehmet@startup.io', name: 'Mehmet Öz', fields: [field1, field2, field3, field4, field5, field6] },
  ];

  for (const resp of responses) {
    const existing = await prisma.formResponse.findFirst({
      where: { formId: form1.id, respondentEmail: resp.email },
    });

    if (!existing) {
      const values = [resp.name, resp.email, String(Math.floor(Math.random() * 4) + 7), 'Web Uygulama', String(Math.floor(Math.random() * 3) + 3), 'Harika bir hizmet sunuyorsunuz.'];

      await prisma.formResponse.create({
        data: {
          formId: form1.id,
          respondentEmail: resp.email,
          respondentName: resp.name,
          isComplete: true,
          completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          duration: Math.floor(Math.random() * 120) + 30,
          answers: {
            create: resp.fields.map((field, i) => ({
              fieldId: field.id,
              value: values[i] || '',
            })),
          },
        },
      });
    }
  }

  await prisma.notification.upsert({
    where: { id: 'seed-notif-welcome' },
    update: {},
    create: {
      id: 'seed-notif-welcome',
      userId: demoUser.id,
      title: 'FormForge\'a Hoş Geldiniz!',
      body: 'Pro planınız aktif. Sınırsız form oluşturabilir ve AI destekli özelliklerden yararlanabilirsiniz.',
      type: 'welcome',
      isRead: true,
    },
  });

  await prisma.notification.upsert({
    where: { id: 'seed-notif-response1' },
    update: {},
    create: {
      id: 'seed-notif-response1',
      userId: demoUser.id,
      title: 'Yeni Form Yanıtı',
      body: '"Müşteri Memnuniyet Anketi" formuna yeni bir yanıt geldi.',
      type: 'new_response',
      link: `/forms/${form1.id}/edit`,
      isRead: false,
    },
  });

  await prisma.notification.upsert({
    where: { id: 'seed-notif-response2' },
    update: {},
    create: {
      id: 'seed-notif-response2',
      userId: demoUser.id,
      title: '128 Yeni Kayıt!',
      body: '"Teknoloji Konferansı Kayıt Formu" rekor sayıda katılımcıya ulaştı.',
      type: 'milestone',
      link: `/forms/${form2.id}/edit`,
      isRead: false,
    },
  });

  console.log('Seed tamamlandı: FormForge demo verileri oluşturuldu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
