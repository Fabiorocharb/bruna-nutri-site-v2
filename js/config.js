/* Preencha apenas com dados confirmados da profissional.
   Sem WhatsApp/endereço, o site direciona ao Instagram já informado no projeto. */
window.SITE_CONFIG = {
  whatsapp: '5521983265333', // Formato internacional: 55 + DDD + número, apenas dígitos.
  phoneDisplay: '+55 21 98326-5333',
  email: '',
  address: 'Center Francisco Gonçalves - R. Dr. Mattos, 44 - Sl 301 - Centro, Rio Bonito - RJ, 28800-000',
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('Center Francisco Gonçalves, R. Dr. Mattos, 44 - Centro, Rio Bonito - RJ, 28800-000'),
  mapsEmbedUrl: 'https://www.google.com/maps?q=' + encodeURIComponent('Center Francisco Gonçalves, R. Dr. Mattos, 44 - Centro, Rio Bonito - RJ, 28800-000') + '&output=embed&hl=pt-BR&z=17',
  instagram: 'https://www.instagram.com/brunapiresnutricionista/',
  videos: { tea: '', seletividade: '', infancia: '' } // URLs de arquivos MP4/WebM.
};
