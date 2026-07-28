-- ============================================================
--  CineStats — trancar o acesso ao banco na nuvem
--  Rode no Supabase: menu lateral > SQL Editor > New query
--  Cole um PASSO por vez e clique em RUN. NÃO rode tudo de uma vez.
-- ============================================================


-- ------------------------------------------------------------
--  ANTES DE COMEÇAR (fora daqui, na interface do Supabase)
--
--  1. Menu lateral > Authentication > Users > "Add user"
--     Crie um usuário com seu e-mail e uma senha sua.
--     Marque "Auto Confirm User" para não precisar confirmar por e-mail.
--
--  Só depois disso rode o PASSO 1 abaixo.
-- ------------------------------------------------------------


-- ============================================================
--  PASSO 1  — preparar (seguro, o app atual continua funcionando)
--  Troque SEU-EMAIL-AQUI pelo e-mail que você acabou de cadastrar.
-- ============================================================

alter table public.cinestats_state
  add column if not exists user_id uuid references auth.users(id);

update public.cinestats_state
   set user_id = (select id from auth.users where email = 'SEU-EMAIL-AQUI')
 where id = 'tiago';

-- Conferência: tem que aparecer uma linha com user_id preenchido.
-- Se vier vazio, o e-mail está diferente do cadastrado. Corrija e rode de novo.
select id, user_id, updated_at from public.cinestats_state;


-- ============================================================
--  PARE AQUI.
--
--  Agora publique o index.html novo + sw.js no GitHub, abra o app,
--  vá em Perfil > Ajustes > "Conta e sincronização" e faça login.
--  Confirme que aparece "Conectado como ... Sincronizacao ativa."
--  e que uma nota nova é salva normalmente.
--
--  Só quando isso estiver funcionando, rode o PASSO 2.
-- ============================================================


-- ============================================================
--  PASSO 2  — trancar de verdade
--  A partir daqui, quem não estiver logado não lê nem escreve nada.
-- ============================================================

alter table public.cinestats_state enable row level security;

drop policy if exists "dono le"      on public.cinestats_state;
drop policy if exists "dono insere"  on public.cinestats_state;
drop policy if exists "dono atualiza" on public.cinestats_state;

create policy "dono le"
  on public.cinestats_state for select
  using (auth.uid() = user_id);

create policy "dono insere"
  on public.cinestats_state for insert
  with check (auth.uid() = user_id);

create policy "dono atualiza"
  on public.cinestats_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================
--  SE ALGO DER ERRADO — desfaz o PASSO 2 e volta ao estado anterior
--  (o app volta a funcionar como antes, mas fica aberto de novo)
-- ============================================================
-- alter table public.cinestats_state disable row level security;
