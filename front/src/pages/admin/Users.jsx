import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  UserPlus,
  Ban,
  ChevronLeft,
  Loader2,
  ChevronDown,
  Check,
  User,
  Shield,
  Award,
  Mail,
  Calendar as CalendarIcon,
  MoreVertical,
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users.js";

const roleToFilter = (role) => {
  if (role === "ADMIN") return "admin";
  if (role === "JURY") return "jury";
  return "user";
};

const ROLES = [
  { value: "REALISATEUR", label: "Réalisateur", icon: User, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10", borderColor: "border-[#51A2FF]/20" },
  { value: "JURY", label: "Juré", icon: Award, color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  { value: "ADMIN", label: "Admin", icon: Shield, color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/20" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ email: "", username: "", password: "", role: "REALISATEUR" });
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState("");
  const [rolePopupUser, setRolePopupUser] = useState(null);
  const [selectedRoleInPopup, setSelectedRoleInPopup] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.username || user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === "all" || roleToFilter(user.role) === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const r = ROLES.find((x) => x.value === role) || ROLES[0];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${r.bgColor} ${r.borderColor} ${r.color}`}
      >
        <r.icon className="w-3.5 h-3.5" />
        {r.label}
      </span>
    );
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError("");
    setSubmitting(true);
    try {
      await createUser(addForm);
      setShowAddModal(false);
      setAddForm({ email: "", username: "", password: "", role: "REALISATEUR" });
      fetchUsers();
    } catch (err) {
      setAddError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Impossible de supprimer");
    }
  };

  const openRolePopup = (e, user) => {
    e.stopPropagation();
    setRolePopupUser(user);
    setSelectedRoleInPopup(user.role);
  };

  const closeRolePopup = () => {
    setRolePopupUser(null);
    setSelectedRoleInPopup(null);
  };

  const handleConfirmRoleInPopup = async () => {
    if (!rolePopupUser || !selectedRoleInPopup || rolePopupUser.role === selectedRoleInPopup) {
      closeRolePopup();
      return;
    }
    setUpdatingRoleId(rolePopupUser.id);
    try {
      await updateUser(rolePopupUser.id, { role: selectedRoleInPopup });
      closeRolePopup();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Impossible de modifier le rôle");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const filters = [
    { id: "all", label: "Tous" },
    { id: "user", label: "Réalisateurs" },
    { id: "jury", label: "Jurés" },
    { id: "admin", label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="flex justify-start mb-6">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all group px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour au Dashboard</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-3">
                Utilisateurs
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Contrôle du protocole marsAI 2026
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <UserPlus className="w-5 h-5 shrink-0" />
              <span className="text-xs">Ajouter un profil</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#51A2FF] transition-colors pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par identité ou canal mail..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all shadow-inner"
              />
            </div>
            
            <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-x-auto no-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterRole(filter.id)}
                  className={`whitespace-nowrap px-6 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterRole === filter.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#51A2FF]/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initialisation des données...</span>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-10 text-center"
          >
            <Ban className="w-12 h-12 text-red-500/40 mx-auto mb-4" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{error}</p>
            <button onClick={fetchUsers} className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-4">Réessayer</button>
          </motion.div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <div className="col-span-4">Identité Profil</div>
                  <div className="col-span-3">Canal de Communication</div>
                  <div className="col-span-2">Rôle Système</div>
                  <div className="col-span-2">Activité</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <div className="p-24 text-center">
                      <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Aucun profil ne correspond à la recherche</p>
                    </div>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.2) }}
                        className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-white/[0.03] transition-all items-center group"
                      >
                        <div className="col-span-4 flex items-center gap-4 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-lg group-hover:border-[#51A2FF]/30 transition-colors">
                              {(user.username || user.email || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050505]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-sm text-white group-hover:text-[#51A2FF] transition-colors truncate">{user.username || "Anonyme"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <CalendarIcon className="w-3 h-3 text-white/20" />
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-span-3 flex items-center gap-2 text-sm text-white/50 truncate group-hover:text-white/70 transition-colors">
                          <Mail className="w-3.5 h-3.5 shrink-0 opacity-40" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <button
                            type="button"
                            onClick={(e) => openRolePopup(e, user)}
                            disabled={updatingRoleId === user.id}
                            className="group/role inline-flex items-center gap-2 rounded-xl border bg-white/[0.03] hover:bg-white/[0.08] border-white/10 px-3 py-2 transition-all disabled:opacity-50"
                          >
                            {updatingRoleId === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#51A2FF]" />
                            ) : (
                              <>
                                {getRoleBadge(user.role)}
                                <ChevronDown className="w-3.5 h-3.5 text-white/20 group-hover/role:text-white transition-colors" />
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="col-span-2">
                          {user.role === "JURY" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                                {user.votesCompleted ?? 0} Votes
                              </span>
                              <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${Math.min((user.votesCompleted || 0) * 10, 100)}%` }} />
                              </div>
                            </div>
                          )}
                          {user.role === "REALISATEUR" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-[#51A2FF] uppercase tracking-widest">
                                {user.filmsSubmitted ?? 0} Films
                              </span>
                              <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#51A2FF]" style={{ width: `${Math.min((user.filmsSubmitted || 0) * 20, 100)}%` }} />
                              </div>
                            </div>
                          )}
                          {user.role === "ADMIN" && <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Contrôle Total</span>}
                        </div>
                        
                        <div className="col-span-1 flex items-center justify-end">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="w-10 h-10 bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-2xl flex items-center justify-center transition-all group/del"
                            title="Supprimer le profil"
                          >
                            <Ban className="w-4 h-4 text-white/20 group-hover/del:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
              {filteredUsers.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-16 text-center">
                  <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Aucun profil trouvé</p>
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 hover:bg-white/[0.04] transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-xl shrink-0">
                          {(user.username || user.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-base text-white truncate">{user.username || "Anonyme"}</h3>
                          <div className="flex items-center gap-2 mt-1 text-white/40">
                            <Mail className="w-3 h-3" />
                            <p className="text-xs truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="w-10 h-10 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Ban className="w-4 h-4 text-red-500/40" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Rôle Système</p>
                        <button
                          type="button"
                          onClick={(e) => openRolePopup(e, user)}
                          disabled={updatingRoleId === user.id}
                          className="w-full flex items-center justify-between gap-2 rounded-xl border bg-white/[0.03] border-white/10 px-3 py-2.5 transition-all"
                        >
                          {updatingRoleId === user.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[#51A2FF]" />
                          ) : (
                            <>
                              {getRoleBadge(user.role)}
                              <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Activité</p>
                        <div className="h-[42px] flex items-center px-3 rounded-xl bg-white/[0.03] border border-white/10">
                          {user.role === "JURY" && (
                            <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                              {user.votesCompleted ?? 0} Votes
                            </span>
                          )}
                          {user.role === "REALISATEUR" && (
                            <span className="text-xs font-black text-[#51A2FF] uppercase tracking-widest">
                              {user.filmsSubmitted ?? 0} Films
                            </span>
                          )}
                          {user.role === "ADMIN" && <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Contrôle Total</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal ajout utilisateur */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddModal(false);
              setAddError("");
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-10 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#51A2FF] via-purple-600 to-pink-500" />
              
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">
                Nouveau Profil
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Initialisation des accès système</p>

              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-white/30 ml-1 tracking-widest">Canal Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      required
                      value={addForm.email}
                      onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 text-sm transition-all"
                      placeholder="nom@domaine.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-white/30 ml-1 tracking-widest">Identité</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      required
                      value={addForm.username}
                      onChange={(e) => setAddForm((p) => ({ ...p, username: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 text-sm transition-all"
                      placeholder="Nom d'usage"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-white/30 ml-1 tracking-widest">Clé d'accès</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={addForm.password}
                      onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 text-sm transition-all"
                      placeholder="Minimum 6 caractères"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-white/30 ml-1 tracking-widest">Niveau d'Accès</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setAddForm(p => ({ ...p, role: r.value }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          addForm.role === r.value
                            ? `${r.borderColor} ${r.bgColor} ${r.color}`
                            : "border-white/5 bg-white/[0.02] text-white/30 hover:border-white/10"
                        }`}
                      >
                        <r.icon className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {addError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                    {addError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setAddError("");
                    }}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup changement de rôle */}
      <AnimatePresence>
        {rolePopupUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={closeRolePopup}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
              
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">
                Ajustement des Accès
              </h3>
              <p className="text-xl font-black text-white mb-8 truncate">
                {rolePopupUser.username || "Anonyme"}
              </p>
              
              <div className="space-y-3 mb-10">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRoleInPopup(r.value)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] border text-left transition-all ${
                      selectedRoleInPopup === r.value
                        ? `${r.bgColor} ${r.borderColor} ${r.color} shadow-lg`
                        : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${selectedRoleInPopup === r.value ? r.color : 'text-white/20'}`}>
                      <r.icon className="w-5 h-5 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-widest">{r.label}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Niveau {r.value === 'ADMIN' ? '01' : r.value === 'JURY' ? '02' : '03'}</p>
                    </div>
                    {selectedRoleInPopup === r.value && (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeRolePopup}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleInPopup}
                  disabled={rolePopupUser.role === selectedRoleInPopup || updatingRoleId}
                  className="flex-1 py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {updatingRoleId ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Appliquer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
