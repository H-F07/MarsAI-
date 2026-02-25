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
          signup: "S'inscrire",
          pages: {
            login: {
              title: "Connexion",
              username: "Nom d'utilisateur",
              password: "Mot de passe",
              submit: "Se connecter",
              forgotPassword: "Mot de passe oublié?",
              noAccount: "Pas de compte?",
              signUp: "S'inscrire"
            },
            register: {
              title: "Inscription",
              email: "Email",
              username: "Nom d'utilisateur",
              password: "Mot de passe",
              confirmPassword: "Confirmer le mot de passe",
              submit: "S'inscrire",
              hasAccount: "Vous avez déjà un compte?",
              login: "Se connecter"
            }
          }
        },
        pages: {
          landing: {
            festival: "Festival International",
            title: "Cinéma et Intelligence Artificielle",
            location: "Marseille",
            exploreFilms: "Explorer les films",
            agenda: "Voir l'agenda",
            competition: {
              label: "Sélection Officielle",
              title: "Films en Compétition",
              description: "Découvrez une sélection de films créatifs utilisant l'IA, soigneusement sélectionnés par notre jury international.",
              viewSelection: "Voir la sélection complète"
            },
            timeline: {
              label: "Le Protocole Temporel",
              title: "Notre Parcours",
              preparation: "De préparation",
              selection: "Films sélectionnés",
              experience: "Expérience Web3",
              marseille: "À Marseille",
              join: "Rejoindre l'aventure"
            },
            conferences: {
              title: "Deux Journées",
              subtitle: "de Conférences Exceptionnelles",
              item1: "Rencontres avec les créateurs IA de demain",
              item2: "Ateliers pratiques et démonstrations en direct",
              item3: "Débats sur l'avenir du cinéma et de l'IA",
              fullAgenda: "Voir l'agenda complet",
              projections: "Projections Cinématographiques",
              projectionsDesc: "Découvrez les meilleurs films de la compétition en avant-première.",
              workshops: "Ateliers Techniques",
              workshopsDesc: "Maîtrisez les outils de création IA avec nos experts.",
              awards: "Cérémonie des Prix",
              awardsDesc: "Célébrez les talents exceptionnels du festival."
            },
            night: {
              label: "Innovation Nocturne",
              title: "Mars.AI",
              description: "Une soirée immersive où l'art, la technologie et la culture convergent.",
              experience: "Rejoignez-nous pour une expérience inoubliable.",
              date: "8 FÉVRIER",
              time: "20:00 - 04:00",
              book: "Réserver votre place"
            },
            numbers: {
              title: "Les Chiffres",
              subtitle: "du Festival",
              scale: "Dimension Globale",
              countries: "Pays représentés",
              films: "Films soumis"
            },
            partners: {
              label: "Partenaires",
              title: "Nos Partenaires Stratégiques"
            },
            footer: {
              tagline: "Où l'imagination rencontre l'intelligence artificielle.",
              nav: "Navigation",
              gallery: "Galerie",
              program: "Programme",
              top50: "Top 50",
              ticketing: "Billetterie",
              newsletter: "Le Bulletin",
              email: "Votre email",
              ok: "OK",
              copyright: "© 2026 MARS.AI Festival. Tous droits réservés.",
              design: "Design par l'équipe créative",
              legal: "Mentions légales"
            }
          },
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
          signup: "Sign Up",
          pages: {
            login: {
              title: "Login",
              username: "Username",
              password: "Password",
              submit: "Sign In",
              forgotPassword: "Forgot password?",
              noAccount: "Don't have an account?",
              signUp: "Sign Up"
            },
            register: {
              title: "Register",
              email: "Email",
              username: "Username",
              password: "Password",
              confirmPassword: "Confirm Password",
              submit: "Sign Up",
              hasAccount: "Already have an account?",
              login: "Log In"
            }
          }
        },
        pages: {
          landing: {
            festival: "International Festival",
            title: "Cinema & Artificial Intelligence",
            location: "Marseille",
            exploreFilms: "Explore Films",
            agenda: "View Agenda",
            competition: {
              label: "Official Selection",
              title: "Films in Competition",
              description: "Discover a curated selection of creative films using AI, carefully selected by our international jury.",
              viewSelection: "View Full Selection"
            },
            timeline: {
              label: "The Temporal Protocol",
              title: "Our Journey",
              preparation: "Months of preparation",
              selection: "Films selected",
              experience: "Web3 Experience",
              marseille: "In Marseille",
              join: "Join the Adventure"
            },
            conferences: {
              title: "Two Days",
              subtitle: "of Exceptional Conferences",
              item1: "Meetings with tomorrow's AI creators",
              item2: "Practical workshops and live demonstrations",
              item3: "Debates on the future of cinema and AI",
              fullAgenda: "View Full Agenda",
              projections: "Film Screenings",
              projectionsDesc: "Discover the best films from the competition in premiere.",
              workshops: "Technical Workshops",
              workshopsDesc: "Master AI creation tools with our experts.",
              awards: "Awards Ceremony",
              awardsDesc: "Celebrate the exceptional talents of the festival."
            },
            night: {
              label: "Nocturnal Innovation",
              title: "Mars.AI",
              description: "An immersive evening where art, technology, and culture converge.",
              experience: "Join us for an unforgettable experience.",
              date: "FEBRUARY 8",
              time: "20:00 - 04:00",
              book: "Book Your Spot"
            },
            numbers: {
              title: "The Numbers",
              subtitle: "of the Festival",
              scale: "Global Dimension",
              countries: "Countries represented",
              films: "Films submitted"
            },
            partners: {
              label: "Partners",
              title: "Our Strategic Partners"
            },
            footer: {
              tagline: "Where imagination meets artificial intelligence.",
              nav: "Navigation",
              gallery: "Gallery",
              program: "Program",
              top50: "Top 50",
              ticketing: "Ticketing",
              newsletter: "The Bulletin",
              email: "Your email",
              ok: "OK",
              copyright: "© 2026 MARS.AI Festival. All rights reserved.",
              design: "Design by Creative Team",
              legal: "Legal Notice"
            }
          },
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
  lng: "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
