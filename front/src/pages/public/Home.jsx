import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/common/ImageWithFallBack";
import { TopBar } from "../../layouts/TopBar";
import {
  ArrowRight,
  Play,
  Calendar,
  Sparkles,
  Users,
  Award,
  Clock,
} from "lucide-react";

// Import images from Figma
import imgRevesSynthetiques from "../../assets/Image/33b7d0b9228d904d0c7a25d5a6474a97bdb0c799.png";
import imgCodeQuantique from "../../assets/Image/2a36b4071dbaca8c1fe10d67a48e4aba0a375cc8.png";
import imgEchosDuFutur from "../../assets/Image/f44ef0fc9641fe42c8a8e189a434ce74f4a29955.png";

// Partner Logos
import imgLogo1 from "../../assets/Image/4acb560ae2e727a6a37837ae9574bf6c08a271c8.png";
import imgLogo2 from "../../assets/Image/83fbf140f57b899c976e236d877758bbb8eda98a.png";
import imgLogo3 from "../../assets/Image/368cd55c89c85ac47a6120fc0834c49ef2387ad0.png";
import imgLogo4 from "../../assets/Image/3b0df5010436dc5724dcd4a8821d268af56caa7e.png";
import imgLogo5 from "../../assets/Image/8bda8b1a311ace4c1ca756fc036b819a50be97fb.png";

function Home({ onNavigate }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background text-foreground font-['Arimo',_sans-serif] overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-400">
      <TopBar onNavigate={(page) => onNavigate(page)} currentPage="landing" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-16 overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-20 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#51A2FF]/5 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full mb-12"
          >
            <Sparkles className="w-4 h-4 text-[#51A2FF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#51A2FF]">{t('pages.landing.festival')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-[140px] lg:text-[180px] font-black leading-[0.85] uppercase tracking-tighter mb-8"
          >
            MARS<span className="text-purple-500">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-normal leading-relaxed"
          >
            {t('pages.landing.title')} <br />
            <span className="text-white/60 font-medium">{t('pages.landing.location')}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <button
              onClick={() => onNavigate('home')}
              className="group relative bg-white text-black px-10 md:px-14 py-5 md:py-6 rounded-full text-sm font-black uppercase tracking-[0.14em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t('pages.landing.exploreFilms')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => onNavigate('agenda')}
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 md:px-14 py-5 md:py-6 rounded-full text-sm font-black uppercase tracking-[0.14em] hover:bg-white/10 transition-all active:scale-95"
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                {t('pages.landing.agenda')}
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section: Compétition */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-background">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[#51A2FF] mb-6 uppercase font-bold tracking-[0.4em] text-xs">
                <div className="w-8 h-px bg-[#51A2FF]" />
                <span>{t('pages.landing.competition.label')}</span>
              </div>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.95] mb-6 md:mb-8">
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">{t('pages.landing.competition.title')}</span>
              </h2>
              <p className="text-white/30 text-lg md:text-xl font-normal max-w-xl leading-relaxed">
                {t('pages.landing.competition.description')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('discover')}
              className="flex items-center gap-4 text-white font-black uppercase tracking-[0.14em] text-sm group shrink-0"
            >
              <span className="hidden md:inline">{t('pages.landing.competition.viewSelection')}</span>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <MovieCard
              title="Protocol Alpha"
              director="Stark"
              badges={["SORA", "GPT"]}
              image={imgRevesSynthetiques}
            />
            <MovieCard
              title="Neural Dream"
              director="Vance"
              badges={["RUNWAY"]}
              image={imgCodeQuantique}
            />
            <MovieCard
              title="Cyber Marseille"
              director="Lupin"
              badges={["MIDJOURNEY"]}
              image={imgEchosDuFutur}
            />
          </div>
        </div>
      </section>

      {/* Section: Le Protocole Temporel */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-8 md:w-12 h-px bg-white/10" />
            <span className="text-purple-400 font-bold uppercase tracking-[0.4em] text-[10px]">{t('pages.landing.timeline.label')}</span>
            <div className="w-8 md:w-12 h-px bg-white/10" />
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-16 md:mb-24">
            {t('pages.landing.timeline.title')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
            <StatBox title="2 MOIS" subtitle={t('pages.landing.timeline.preparation')} color="purple" />
            <StatBox title="50 FILMS" subtitle={t('pages.landing.timeline.selection')} color="emerald" />
            <StatBox title="WEB 3.0" subtitle={t('pages.landing.timeline.experience')} color="pink" />
            <StatBox title="J4" subtitle={t('pages.landing.timeline.marseille')} color="cyan" />
          </div>

          <button
            onClick={() => onNavigate('signup')}
            className="px-10 md:px-14 py-5 md:py-6 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white font-black uppercase tracking-[0.16em] text-sm md:text-base shadow-[0_20px_40px_-10px_rgba(168,85,247,0.3)] hover:scale-105 transition-all active:scale-95"
          >
            {t('pages.landing.timeline.join')}
          </button>
        </div>
      </section>

      {/* Section: Deux Journées de Conférences */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[#080808]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-20 items-start mb-16 md:mb-24">
            <div className="lg:col-span-3">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[0.9]">
                {t('pages.landing.conferences.title')} <br />
                <span className="text-purple-500 underline decoration-purple-500/30 decoration-2 underline-offset-8">{t('pages.landing.conferences.subtitle')}</span>
              </h2>

              <ul className="space-y-3 md:space-y-4 text-white/70 text-base md:text-xl font-normal mb-8 md:mb-12 leading-relaxed list-disc list-inside">
                <li>{t('pages.landing.conferences.item1')}</li>
                <li>{t('pages.landing.conferences.item2')}</li>
                <li>{t('pages.landing.conferences.item3')}</li>
              </ul>

              <button
                onClick={() => onNavigate('agenda')}
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.12em] hover:bg-white/10 transition-colors"
              >
                <Calendar className="w-4 h-4 text-pink-400" />
                {t('pages.landing.conferences.fullAgenda')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <EventCard
              title={t('pages.landing.conferences.projections')}
              description={t('pages.landing.conferences.projectionsDesc')}
              icon={Play}
              iconColor="purple"
              variant="light"
            />
            <EventCard
              title={t('pages.landing.conferences.workshops')}
              description={t('pages.landing.conferences.workshopsDesc')}
              icon={Users}
              iconColor="pink"
            />
            <EventCard
              title={t('pages.landing.conferences.awards')}
              description={t('pages.landing.conferences.awardsDesc')}
              icon={Award}
              iconColor="emerald"
            />
          </div>
        </div>
      </section>

      {/* Section: Mars.AI Night */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden p-8 md:p-16 lg:p-20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-block bg-purple-500/20 text-purple-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded mb-6 md:mb-8">
                  {t('pages.landing.night.label')}
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-[90px] font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[0.9]">
                  {t('pages.landing.night.title')} <br />
                  <span className="text-pink-500 italic font-black">NIGHT</span>
                </h2>
                <p className="text-white/40 text-base md:text-lg font-normal leading-relaxed">
                  {t('pages.landing.night.description')} <br />
                  {t('pages.landing.night.experience')}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] md:rounded-[32px] p-8 md:p-10 text-center min-w-[260px] md:min-w-[280px] shadow-2xl">
                <Clock className="w-10 h-10 text-pink-500 mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">{t('pages.landing.night.date')}</h3>
                <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px] mb-8 md:mb-10">{t('pages.landing.night.time')}</p>
                <button className="w-full bg-white text-black py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.16em] text-sm hover:bg-pink-500 hover:text-white transition-all">
                  {t('pages.landing.night.book')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Chiffres Projetés */}
      <section className="py-20 md:py-32 px-4 md:px-6 border-y border-white/5 bg-[#080808]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4 md:mb-6">
                {t('pages.landing.numbers.title')} <br />
                <span className="text-pink-500">{t('pages.landing.numbers.subtitle')}</span>
              </h2>
              <p className="text-white/30 font-medium uppercase tracking-[0.12em] text-xs">{t('pages.landing.numbers.scale')}</p>
            </div>

            <StatCard value="+120" label={t('pages.landing.numbers.countries')} color="purple" />
            <StatCard value="+600" label={t('pages.landing.numbers.films')} color="pink" />
          </div>
        </div>
      </section>

      {/* Section: Partenaires */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4 mb-12 md:mb-20">
            <div className="flex items-center gap-2 text-white/20 font-bold uppercase tracking-[0.4em] text-[10px]">
              <div className="w-8 md:w-12 h-px bg-white/10" />
              <span>{t('pages.landing.partners.label')}</span>
              <div className="w-8 md:w-12 h-px bg-white/10" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
              {t('pages.landing.partners.title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[imgLogo1, imgLogo2, imgLogo3, imgLogo4, imgLogo5].slice(0, 4).map((logo, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/5 p-8 md:p-12 rounded-[20px] md:rounded-[24px] flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group min-h-[140px] md:min-h-[180px]"
              >
                <ImageWithFallback
                  src={logo}
                  className="max-h-10 md:max-h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 md:pt-32 pb-12 md:pb-16 border-t border-white/5 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-20 md:mb-32">
            <div className="md:col-span-5 flex flex-col gap-8 md:gap-10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black uppercase tracking-tight">MARS</span>
                <span className="text-3xl md:text-4xl font-black uppercase tracking-tight text-purple-500">AI</span>
              </div>
              <p className="text-white/30 text-base md:text-lg font-light leading-relaxed max-w-sm italic">
                {t('pages.landing.footer.tagline')}
              </p>
            </div>

            <div className="md:col-span-3 flex flex-col gap-6 md:gap-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">{t('pages.landing.footer.nav')}</span>
              <ul className="space-y-3 md:space-y-4 font-bold text-white/40 text-sm uppercase tracking-[0.14em]">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">{t('pages.landing.footer.gallery')}</button></li>
                <li><button onClick={() => onNavigate('agenda')} className="hover:text-white transition-colors">{t('pages.landing.footer.program')}</button></li>
                <li><button onClick={() => onNavigate('competition')} className="hover:text-white transition-colors">{t('pages.landing.footer.top50')}</button></li>
                <li><button onClick={() => onNavigate('ticket')} className="hover:text-white transition-colors">{t('pages.landing.footer.ticketing')}</button></li>
              </ul>
            </div>

            <div className="md:col-span-4 flex flex-col gap-8 md:gap-10">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[32px] md:rounded-[40px]">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
                  {t('pages.landing.footer.newsletter')}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('pages.landing.footer.email')}
                    className="bg-white/5 border border-white/10 rounded-2xl px-5 md:px-6 py-3 md:py-4 flex-1 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-white/20"
                  />
                  <button className="bg-white text-black px-5 md:px-6 py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-[0.14em] hover:bg-purple-500 hover:text-white transition-all">
                    {t('pages.landing.footer.ok')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 opacity-20 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="text-center md:text-left">{t('pages.landing.footer.copyright')}</span>
            <div className="flex flex-wrap gap-6 md:gap-12 justify-center">
              <span>{t('pages.landing.footer.design')}</span>
              <span>{t('pages.landing.footer.legal')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Components

function MovieCard({ title, director, badges, image }) {
  return (
    <div className="group rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/5 border border-white/10 transition-all hover:border-white/20 hover:bg-white/[0.07]">
      <div className="aspect-[3/2] relative overflow-hidden bg-white/5">
        <ImageWithFallback
          src={image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 md:px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-[0.09em]"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20">
            <Play className="w-5 md:w-6 h-5 md:h-6 fill-white ml-1 text-white" />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">{title}</h3>
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">DIR. {director}</p>
      </div>
    </div>
  );
}

function StatBox({ title, subtitle, color }) {
  const colorMap = {
    purple: 'text-purple-500',
    emerald: 'text-emerald-500',
    pink: 'text-pink-500',
    cyan: 'text-[#51A2FF]',
    rose: 'text-pink-500',
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-10 hover:bg-white/10 transition-all text-center">
      <h3 className={`text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2 ${colorMap[color] || colorMap.purple}`}>
        {title}
      </h3>
      <p className="text-white/20 font-bold uppercase tracking-[0.1em] text-[10px]">{subtitle}</p>
    </div>
  );
}

function EventCard({ title, description, icon: Icon, iconColor, variant = 'dark' }) {
  const iconColorMap = {
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    emerald: 'text-emerald-600',
  };

  const isLight = variant === 'light';

  return (
    <div className={`p-8 md:p-10 rounded-[32px] md:rounded-[40px] border transition-all hover:scale-[1.02] ${
      isLight
        ? 'bg-white text-black border-white'
        : 'bg-white/5 text-white border-white/10 hover:bg-white/[0.07]'
    }`}>
      <Icon className={`w-8 md:w-10 h-8 md:h-10 mb-6 md:mb-8 ${isLight ? iconColorMap[iconColor] : `text-${iconColor}-400`}`} />
      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 md:mb-6">{title}</h3>
      <p className={`text-sm md:text-base font-normal leading-relaxed ${isLight ? 'text-black/60' : 'text-white/30'}`}>
        {description}
      </p>
    </div>
  );
}

function StatCard({ value, label, color }) {
  const colorMap = {
    purple: 'text-purple-500',
    pink: 'text-pink-500',
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] md:rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl hover:bg-white/10 transition-all">
      <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-2 text-white">{value}</span>
      <span className={`font-black uppercase tracking-[0.4em] text-[10px] ${colorMap[color]}`}>{label}</span>
    </div>
  );
}

export default Home;
