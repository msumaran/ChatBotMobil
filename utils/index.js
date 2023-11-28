import FacebookIcon from '../assets/icons/facebook.svg';
import WhatsAppIcon from '../assets/icons/whatsapp.svg';
import InstagramIcon from '../assets/icons/instagram.svg';

export const getIconForChat = (medio) => {
    switch (medio) {
      case 'Messenger':
        return <FacebookIcon fill={'#4564dc'} width={32} height={32} />;
      case 'WhatsApp':
        return <WhatsAppIcon fill={'green'} width={32} height={32} />;
      case 'Instagram':
        return <InstagramIcon fill={'ec0075'} width={32} height={32} />;
      default:
        return ""; // o un icono predeterminado si lo prefieres
    }
  };
  
