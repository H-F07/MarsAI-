import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        nav: {
          home: "Accueil",
          discover: "Découvrir",
          competition: "Concours",
          agenda: "Agenda",
          profile: "Profil",
          submit: "Soumettre"
        },
        lang: {
          fr: "FR",
          en: "EN"
        },
        auth: {
          login: "Se connecter",
          join: "Participer",
          signup: "S'inscrire"
        },
        pages: {
          home: {
            title: "Bienvenue sur MarsAI",
            subtitle: "La plateforme des talents musicaux"
          },
          discover: {
            title: "Explorer",
            worksCount: "œuvres",
            search: "Rechercher un film, un réalisateur...",
            by: "by",
            categories: {
              all: "Tous",
              scifi: "Sci-Fi",
              digitalArt: "Art Numérique",
              animation: "Animation",
              experimental: "Expérimental",
              romance: "Romance",
              drama: "Drame",
              comedy: "Comédie",
              thriller: "Thriller",
              philosophical: "Philosophique"
            }
          },
          competition: {
            live: "CLASSEMENT EN DIRECT • MARSAI 2026",
            title: "LE TOP 50",
            subtitle: "Découvrez les créations qui captivent l'imagination. Les 10 premiers films accéderont à la phase finale de sélection du jury.",
            general: "Compétition Générale",
            film: "Film",
            performance: "Performance",
            applause: "applaudis",
            views: "vues",
            by: "by"
          },
          agenda: {
            title: "Agenda",
            description: "Bienvenue sur la page agenda."
          },
          profile: {
            follow: "Suivre",
            biography: "Biographie",
            bio: "\"Chaque image que je crée est une fenêtre ouverte sur un monde qui n'existe pas encore. L'IA est mon pinceau, l'imagination est ma toile.\"",
            location: "Chine",
            since: "Depuis Janvier 2024",
            audience: "Audience",
            subscribers: "abonnés",
            subscriptions: "abonnements",
            stats: {
              films: "Films publiés",
              applause: "Applaudissements",
              views: "Vues totales"
            },
            tabs: {
              portfolio: "Portfolio",
              favorites: "Favoris",
              bio: "Bio"
            },
            views: "vues",
            noSubmissions: "Aucune soumission pour l'instant."
          },
          soumission: {
            title: "Soumission",
            description: "Bienvenue sur la page de soumission."
          }
        }
      }
    },
    en: {
      translation: {
        nav: {
          home: "Home",
          discover: "Discover",
          competition: "Competition",
          agenda: "Agenda",
          profile: "Profile",
          submit: "Submit"
        },
        lang: {
          fr: "FR",
          en: "EN"
        },
        auth: {
          login: "Log In",
          join: "Join",
          signup: "Sign Up"
        },
        pages: {
          home: {
            title: "Welcome to MarsAI",
            subtitle: "The platform for musical talents"
          },
          discover: {
            title: "Explore",
            worksCount: "works",
            search: "Search for a film, a director...",
            by: "by",
            categories: {
              all: "All",
              scifi: "Sci-Fi",
              digitalArt: "Digital Art",
              animation: "Animation",
              experimental: "Experimental",
              romance: "Romance",
              drama: "Drama",
              comedy: "Comedy",
              thriller: "Thriller",
              philosophical: "Philosophical"
            }
          },
          competition: {
            live: "LIVE RANKINGS • MARSAI 2026",
            title: "THE TOP 50",
            subtitle: "Discover the creations that captivate the imagination. The top 10 films will advance to the final jury selection phase.",
            general: "General Competition",
            film: "Film",
            performance: "Performance",
            applause: "applause",
            views: "views",
            by: "by"
          },
          agenda: {
            title: "Agenda",
            description: "Welcome to the agenda page."
          },
          profile: {
            follow: "Follow",
            biography: "Biography",
            bio: "\"Every image I create is an open window to a world that doesn't exist yet. AI is my brush, imagination is my canvas.\"",
            location: "China",
            since: "Since January 2024",
            audience: "Audience",
            subscribers: "subscribers",
            subscriptions: "subscriptions",
            stats: {
              films: "Films published",
              applause: "Applause",
              views: "Total views"
            },
            tabs: {
              portfolio: "Portfolio",
              favorites: "Favorites",
              bio: "Bio"
            },
            views: "views",
            noSubmissions: "No submissions yet."
          },
          soumission: {
            title: "Submission",
            description: "Welcome to the submission page."
          }
        }
      }
    }
  },
  lng: "fr", // langue par défaut
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
