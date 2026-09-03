--
-- PostgreSQL database dump
--


-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: interaction_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interaction_type_enum AS ENUM (
    'view',
    'contact',
    'favorite',
    'like'
);


--
-- Name: message_senderrole_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_senderrole_enum AS ENUM (
    'seeker',
    'recruiter'
);


--
-- Name: seeker_videostatus_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seeker_videostatus_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'seeker',
    'recruiter'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_sector (
    id integer NOT NULL,
    "activitySector" character varying NOT NULL
);


--
-- Name: activity_sector_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_sector_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_sector_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_sector_id_seq OWNED BY public.activity_sector.id;


--
-- Name: answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answer (
    id integer NOT NULL,
    value double precision NOT NULL,
    "attemptId" integer,
    "questionId" integer
);


--
-- Name: answer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.answer_id_seq OWNED BY public.answer.id;


--
-- Name: attempt; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attempt (
    id integer NOT NULL,
    "questionIds" integer[] DEFAULT '{}'::integer[] NOT NULL,
    score double precision,
    "submittedAt" timestamp without time zone,
    "seekerId" integer
);


--
-- Name: attempt_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attempt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attempt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attempt_id_seq OWNED BY public.attempt.id;


--
-- Name: competence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competence (
    id integer NOT NULL,
    competence character varying NOT NULL
);


--
-- Name: competence_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.competence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: competence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.competence_id_seq OWNED BY public.competence.id;


--
-- Name: interaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interaction (
    id integer NOT NULL,
    type public.interaction_type_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "seenAt" timestamp without time zone,
    "recruiterId" integer,
    "seekerId" integer
);


--
-- Name: interaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interaction_id_seq OWNED BY public.interaction.id;


--
-- Name: localisation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.localisation (
    id integer NOT NULL,
    localisation character varying NOT NULL
);


--
-- Name: localisation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.localisation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: localisation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.localisation_id_seq OWNED BY public.localisation.id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    id integer NOT NULL,
    "senderRole" public.message_senderrole_enum NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "seenAt" timestamp without time zone,
    "recruiterId" integer,
    "seekerId" integer
);


--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question (
    id integer NOT NULL,
    label character varying NOT NULL,
    weight double precision DEFAULT '1'::double precision NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_id_seq OWNED BY public.question.id;


--
-- Name: recruiter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recruiter (
    id integer NOT NULL,
    "companyName" character varying NOT NULL,
    "userId" uuid
);


--
-- Name: recruiter_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recruiter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recruiter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recruiter_id_seq OWNED BY public.recruiter.id;


--
-- Name: seeker; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seeker (
    id integer NOT NULL,
    name character varying NOT NULL,
    lastname character varying NOT NULL,
    certification boolean DEFAULT false NOT NULL,
    video character varying,
    "userId" uuid,
    "videoStatus" public.seeker_videostatus_enum DEFAULT 'pending'::public.seeker_videostatus_enum NOT NULL,
    "videoRejectionReason" text,
    "videoModeratedAt" timestamp without time zone,
    "videoModeratedBy" uuid,
    "videoConsentGivenAt" timestamp without time zone,
    "videoConsentVersion" character varying
);


--
-- Name: seeker_activity_sectors_activity_sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seeker_activity_sectors_activity_sector (
    "seekerId" integer NOT NULL,
    "activitySectorId" integer NOT NULL
);


--
-- Name: seeker_competences_competence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seeker_competences_competence (
    "seekerId" integer NOT NULL,
    "competenceId" integer NOT NULL
);


--
-- Name: seeker_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seeker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seeker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seeker_id_seq OWNED BY public.seeker.id;


--
-- Name: seeker_localisations_localisation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seeker_localisations_localisation (
    "seekerId" integer NOT NULL,
    "localisationId" integer NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum NOT NULL,
    "birthDate" date NOT NULL
);


--
-- Name: activity_sector id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_sector ALTER COLUMN id SET DEFAULT nextval('public.activity_sector_id_seq'::regclass);


--
-- Name: answer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer ALTER COLUMN id SET DEFAULT nextval('public.answer_id_seq'::regclass);


--
-- Name: attempt id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt ALTER COLUMN id SET DEFAULT nextval('public.attempt_id_seq'::regclass);


--
-- Name: competence id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competence ALTER COLUMN id SET DEFAULT nextval('public.competence_id_seq'::regclass);


--
-- Name: interaction id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction ALTER COLUMN id SET DEFAULT nextval('public.interaction_id_seq'::regclass);


--
-- Name: localisation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localisation ALTER COLUMN id SET DEFAULT nextval('public.localisation_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question ALTER COLUMN id SET DEFAULT nextval('public.question_id_seq'::regclass);


--
-- Name: recruiter id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter ALTER COLUMN id SET DEFAULT nextval('public.recruiter_id_seq'::regclass);


--
-- Name: seeker id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker ALTER COLUMN id SET DEFAULT nextval('public.seeker_id_seq'::regclass);


--
-- Data for Name: activity_sector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_sector (id, "activitySector") FROM stdin;
1	Informatique et numérique
2	Commerce et vente
3	Restauration et hôtellerie
4	Bâtiment et travaux publics
5	Santé et action sociale
6	Industrie et production
7	Transport et logistique
8	Administration et gestion
9	Éducation et formation
10	Artisanat
11	Agriculture
12	Banque et assurance
13	Marketing et communication
14	Sécurité
15	Environnement et énergie
\.


--
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.answer (id, value, "attemptId", "questionId") FROM stdin;
226	5	10	1
227	5	10	2
228	5	10	3
229	5	10	4
230	5	10	5
231	5	10	6
232	5	10	7
233	5	10	8
234	5	10	9
235	5	10	10
236	5	10	11
237	5	10	12
238	5	10	13
239	5	10	14
240	5	10	15
241	5	10	16
242	5	10	17
243	5	10	18
244	5	10	19
245	5	10	20
246	5	10	21
247	5	10	22
248	5	10	23
249	5	10	24
250	5	10	25
251	5	10	26
252	5	10	27
253	5	10	28
254	5	10	29
255	5	10	30
256	5	10	31
257	5	10	32
258	5	10	33
259	5	10	34
260	5	10	35
261	5	10	36
262	5	10	37
263	5	10	38
264	5	10	39
265	5	10	40
266	5	10	41
267	5	10	42
268	5	10	43
269	5	10	44
270	5	10	45
271	5	10	46
272	5	10	47
273	5	10	48
274	5	10	49
275	5	10	50
276	5	10	51
277	5	10	52
278	5	10	53
279	5	10	54
280	5	10	55
281	5	10	56
282	5	10	57
283	5	10	58
284	5	10	59
285	5	10	60
286	5	10	61
287	5	10	62
288	5	10	63
289	5	10	64
290	5	10	65
291	5	10	66
292	5	10	67
293	5	10	68
294	5	10	69
295	5	10	70
296	5	10	71
297	5	10	72
298	5	10	73
299	5	10	74
300	5	10	75
301	5	10	76
302	5	10	77
303	5	10	78
304	5	10	79
305	5	10	80
306	5	10	81
307	5	10	82
308	5	10	83
309	5	10	84
310	5	10	85
311	5	10	86
312	5	10	87
313	5	10	88
314	5	10	89
315	5	10	90
316	5	10	91
317	5	10	92
318	5	10	93
319	5	10	94
320	5	10	95
321	5	10	96
322	5	10	97
323	5	10	98
324	5	10	99
325	5	10	100
326	5	11	1
327	5	11	2
328	5	11	3
329	5	11	4
330	5	11	5
331	5	11	6
332	5	11	7
333	5	11	8
334	5	11	9
335	5	11	10
336	5	11	11
337	5	11	12
338	5	11	13
339	5	11	14
340	5	11	15
341	5	11	16
342	5	11	17
343	5	11	18
344	5	11	19
345	5	11	20
346	5	11	21
347	5	11	22
348	5	11	23
349	5	11	24
350	5	11	25
351	5	11	26
352	5	11	27
353	5	11	28
354	5	11	29
355	5	11	30
356	5	11	31
357	5	11	32
358	5	11	33
359	5	11	34
360	5	11	35
361	5	11	36
362	5	11	37
363	5	11	38
364	5	11	39
365	5	11	40
366	5	11	41
367	5	11	42
368	5	11	43
369	5	11	44
370	5	11	45
371	5	11	46
372	5	11	47
373	5	11	48
374	5	11	49
375	5	11	50
376	5	11	51
377	5	11	52
378	5	11	53
379	5	11	54
380	5	11	55
381	5	11	56
382	5	11	57
383	5	11	58
384	5	11	59
385	5	11	60
386	5	11	61
387	5	11	62
388	5	11	63
389	5	11	64
390	5	11	65
391	5	11	66
392	5	11	67
393	5	11	68
394	5	11	69
395	5	11	70
396	5	11	71
397	5	11	72
398	5	11	73
399	5	11	74
400	5	11	75
401	5	11	76
402	5	11	77
403	5	11	78
404	5	11	79
405	5	11	80
406	5	11	81
407	5	11	82
408	5	11	83
409	5	11	84
410	5	11	85
411	5	11	86
412	5	11	87
413	5	11	88
414	5	11	89
415	5	11	90
416	5	11	91
417	5	11	92
418	5	11	93
419	5	11	94
420	5	11	95
421	5	11	96
422	5	11	97
423	5	11	98
424	5	11	99
425	5	11	100
426	5	12	1
427	5	12	2
428	5	12	3
429	5	12	4
430	5	12	5
431	5	12	6
432	5	12	7
433	5	12	8
434	5	12	9
435	5	12	10
436	5	12	11
437	5	12	12
438	5	12	13
439	5	12	14
440	5	12	15
441	5	12	16
442	5	12	17
443	5	12	18
444	5	12	19
445	5	12	20
446	5	12	21
447	5	12	22
448	5	12	23
449	5	12	24
450	5	12	25
451	5	12	26
452	5	12	27
453	5	12	28
454	5	12	29
455	5	12	30
456	5	12	31
457	5	12	32
458	5	12	33
459	5	12	34
460	5	12	35
461	5	12	36
462	5	12	37
463	5	12	38
464	5	12	39
465	5	12	40
466	5	12	41
467	5	12	42
468	5	12	43
469	5	12	44
470	5	12	45
471	5	12	46
472	5	12	47
473	5	12	48
474	5	12	49
475	5	12	50
476	5	12	51
477	5	12	52
478	5	12	53
479	5	12	54
480	5	12	55
481	5	12	56
482	5	12	57
483	5	12	58
484	5	12	59
485	5	12	60
486	5	12	61
487	5	12	62
488	5	12	63
489	5	12	64
490	5	12	65
491	5	12	66
492	5	12	67
493	5	12	68
494	5	12	69
495	5	12	70
496	5	12	71
497	5	12	72
498	5	12	73
499	5	12	74
500	5	12	75
501	5	12	76
502	5	12	77
503	5	12	78
504	5	12	79
505	5	12	80
506	5	12	81
507	5	12	82
508	5	12	83
509	5	12	84
510	5	12	85
511	5	12	86
512	5	12	87
513	5	12	88
514	5	12	89
515	5	12	90
516	5	12	91
517	5	12	92
518	5	12	93
519	5	12	94
520	5	12	95
521	5	12	96
522	5	12	97
523	5	12	98
524	5	12	99
525	5	12	100
526	5	13	1
527	5	13	2
528	5	13	3
529	5	13	4
530	5	13	5
531	5	13	6
532	5	13	7
533	5	13	8
534	5	13	9
535	5	13	10
536	5	13	11
537	5	13	12
538	5	13	13
539	5	13	14
540	5	13	15
541	5	13	16
542	5	13	17
543	5	13	18
544	5	13	19
545	5	13	20
546	5	13	21
547	5	13	22
548	5	13	23
549	5	13	24
550	5	13	25
551	5	13	26
552	5	13	27
553	5	13	28
554	5	13	29
555	5	13	30
556	5	13	31
557	5	13	32
558	5	13	33
559	5	13	34
560	5	13	35
561	5	13	36
562	5	13	37
563	5	13	38
564	5	13	39
565	5	13	40
566	5	13	41
567	5	13	42
568	5	13	43
569	5	13	44
570	5	13	45
571	5	13	46
572	5	13	47
573	5	13	48
574	5	13	49
575	5	13	50
576	5	13	51
577	5	13	52
578	5	13	53
579	5	13	54
580	5	13	55
581	5	13	56
582	5	13	57
583	5	13	58
584	5	13	59
585	5	13	60
586	5	13	61
587	5	13	62
588	5	13	63
589	5	13	64
590	5	13	65
591	5	13	66
592	5	13	67
593	5	13	68
594	5	13	69
595	5	13	70
596	5	13	71
597	5	13	72
598	5	13	73
599	5	13	74
600	5	13	75
601	5	13	76
602	5	13	77
603	5	13	78
604	5	13	79
605	5	13	80
606	5	13	81
607	5	13	82
608	5	13	83
609	5	13	84
610	5	13	85
611	5	13	86
612	5	13	87
613	5	13	88
614	5	13	89
615	5	13	90
616	5	13	91
617	5	13	92
618	5	13	93
619	5	13	94
620	5	13	95
621	5	13	96
622	5	13	97
623	5	13	98
624	5	13	99
625	5	13	100
\.


--
-- Data for Name: attempt; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attempt (id, "questionIds", score, "submittedAt", "seekerId") FROM stdin;
10	{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100}	100	2026-09-03 08:18:47.324	13
11	{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100}	100	2026-09-03 08:18:47.422	14
12	{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100}	100	2026-09-03 08:18:47.517	15
13	{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100}	100	2026-09-03 08:19:34.621	17
\.


--
-- Data for Name: competence; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.competence (id, competence) FROM stdin;
1	Communication
2	Travail d'équipe
3	Gestion de projet
4	Résolution de problèmes
5	Organisation
6	Rigueur
7	Autonomie
8	Adaptabilité
9	Prise de parole en public
10	Gestion du temps
11	Comptabilité
12	Vente
13	Relation client
14	Marketing digital
15	Bureautique (Pack Office)
16	Développement web
17	Développement logiciel
18	Analyse de données
19	Gestion de base de données
20	Cybersécurité
21	Langue anglaise
22	Langue espagnole
23	Permis B
24	Management d'équipe
25	Négociation
26	Rédaction
27	Logistique
28	Maintenance technique
29	Cuisine
30	Service en salle
\.


--
-- Data for Name: interaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interaction (id, type, "createdAt", "seenAt", "recruiterId", "seekerId") FROM stdin;
51	contact	2026-09-03 08:25:39.70348	\N	12	13
52	contact	2026-09-03 08:25:39.728217	\N	12	14
55	view	2026-09-03 08:25:39.781301	\N	12	17
56	like	2026-09-03 08:49:49.06096	\N	12	13
57	favorite	2026-09-03 08:49:55.730954	\N	12	15
58	contact	2026-09-03 08:49:56.677799	\N	12	15
\.


--
-- Data for Name: localisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.localisation (id, localisation) FROM stdin;
1	Rennes
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message (id, "senderRole", content, "createdAt", "seenAt", "recruiterId", "seekerId") FROM stdin;
15	seeker	Bonjour, avec plaisir ! Je suis disponible dès demain.	2026-09-03 08:25:47.726276	\N	12	13
14	recruiter	Bonjour Etienne, votre profil correspond exactement à ce que nous cherchons. Seriez-vous disponible pour un échange cette semaine ?	2026-09-03 08:25:47.704061	2026-09-03 08:26:24.364	12	13
16	recruiter	Bonjour !	2026-09-03 08:50:00.921946	\N	12	15
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question (id, label, weight, active) FROM stdin;
1	Je maîtrise les bases de mon métier au quotidien.	1	t
2	Je sais m'adapter rapidement à un nouvel environnement de travail.	1	t
3	Je communique clairement avec mes collègues et supérieurs.	1	t
4	Je suis capable de gérer plusieurs tâches en autonomie.	1	t
5	Je sais résoudre des problèmes imprévus dans mon domaine.	1	t
6	Je respecte les délais fixés pour mes missions.	1	t
7	Je sais organiser ma journée de travail efficacement.	1	t
8	Je m'adapte facilement à un changement de dernière minute.	1	t
9	Je sais prioriser mes tâches selon leur urgence.	1	t
10	Je garde mon calme face à une situation stressante.	1	t
11	Je sais demander de l'aide quand j'en ai besoin.	1	t
12	J'écoute activement les remarques de mes collègues.	1	t
13	Je sais argumenter un point de vue avec des faits.	1	t
14	Je propose des solutions plutôt que de me limiter à constater un problème.	1	t
15	Je sais rédiger un compte-rendu clair et structuré.	1	t
16	Je respecte les consignes de sécurité sur mon poste de travail.	1	t
17	Je sais utiliser un tableur pour organiser des données.	1	t
18	Je sais mener une réunion en respectant l'ordre du jour.	1	t
19	Je sais former une nouvelle personne sur une tâche.	1	t
20	Je sais gérer un désaccord avec un collègue de manière constructive.	1	t
21	Je sais m'exprimer clairement à l'oral devant un groupe.	1	t
22	Je sais anticiper les besoins de mon équipe.	1	t
23	Je sais recevoir une critique sans me braquer.	1	t
24	Je vérifie mon travail avant de le rendre.	1	t
25	Je sais fixer des objectifs réalistes.	1	t
26	Je sais m'organiser pour travailler à distance.	1	t
27	Je sais gérer plusieurs projets en parallèle.	1	t
28	Je sais respecter la confidentialité des informations sensibles.	1	t
29	Je sais m'informer sur les nouveautés de mon secteur.	1	t
30	Je sais utiliser les outils numériques courants (mails, agenda, visioconférence).	1	t
31	Je sais planifier les étapes d'un projet avant de commencer.	1	t
32	Je sais m'exprimer par écrit sans fautes majeures.	1	t
33	Je sais évaluer objectivement la qualité de mon propre travail.	1	t
34	Je sais m'intégrer rapidement dans une nouvelle équipe.	1	t
35	Je sais dire non lorsque c'est nécessaire.	1	t
36	Je sais motiver les autres autour d'un objectif commun.	1	t
37	Je sais rester concentré sur une tâche longue.	1	t
38	Je sais utiliser un logiciel de gestion de projet.	1	t
39	Je sais accueillir un client ou un usager avec courtoisie.	1	t
40	Je sais gérer une caisse ou des transactions financières simples.	1	t
41	Je sais lire et interpréter un cahier des charges.	1	t
42	Je sais respecter une procédure qualité.	1	t
43	Je sais entretenir et nettoyer mon poste de travail.	1	t
44	Je sais manipuler un outil ou une machine en toute sécurité.	1	t
45	Je sais effectuer un diagnostic simple en cas de panne.	1	t
46	Je sais lire un plan ou un schéma technique.	1	t
47	Je sais calculer une quantité ou un dosage avec précision.	1	t
48	Je sais respecter les normes d'hygiène dans mon métier.	1	t
49	Je sais conduire un véhicule utilitaire si nécessaire.	1	t
50	Je sais porter des charges en respectant les gestes et postures.	1	t
51	Je sais utiliser un logiciel de comptabilité de base.	1	t
52	Je sais préparer un devis ou une facture.	1	t
53	Je sais négocier un prix ou des conditions commerciales.	1	t
54	Je sais fidéliser une clientèle.	1	t
55	Je sais analyser les besoins d'un client.	1	t
56	Je sais présenter un produit ou un service de façon convaincante.	1	t
57	Je sais gérer les réclamations d'un client avec diplomatie.	1	t
58	Je sais utiliser les réseaux sociaux dans un cadre professionnel.	1	t
59	Je sais rédiger un contenu pour le web.	1	t
60	Je sais analyser des statistiques simples.	1	t
61	Je sais utiliser un logiciel de traitement de texte avancé.	1	t
62	Je sais programmer dans au moins un langage informatique.	1	t
63	Je sais déboguer un problème technique simple.	1	t
64	Je sais sécuriser mes mots de passe et mes accès numériques.	1	t
65	Je sais sauvegarder mes données régulièrement.	1	t
66	Je sais administrer un site web simple.	1	t
67	Je sais concevoir une maquette ou un visuel simple.	1	t
68	Je sais utiliser un logiciel de retouche d'image.	1	t
69	Je sais monter une courte vidéo.	1	t
70	Je sais m'exprimer dans une langue étrangère à l'oral.	1	t
71	Je sais traduire un document simple dans une langue étrangère.	1	t
72	Je sais m'adapter à un public international.	1	t
73	Je sais travailler en horaires décalés si nécessaire.	1	t
74	Je sais garder ma motivation sur le long terme.	1	t
75	Je sais apprendre une nouvelle compétence en autonomie.	1	t
76	Je sais transmettre mon savoir-faire à un collègue.	1	t
77	Je sais respecter la hiérarchie tout en donnant mon avis.	1	t
78	Je sais m'auto-évaluer pour progresser.	1	t
79	Je sais gérer mon stress avant un entretien ou une échéance.	1	t
80	Je sais m'adapter à un rythme de travail soutenu.	1	t
81	Je sais improviser face à un imprévu.	1	t
82	Je sais coordonner les actions de plusieurs personnes.	1	t
83	Je sais déléguer une tâche efficacement.	1	t
84	Je sais respecter un budget alloué.	1	t
85	Je sais évaluer les risques d'une décision avant de la prendre.	1	t
86	Je sais utiliser les outils de suivi de stock.	1	t
87	Je sais entretenir du matériel professionnel.	1	t
88	Je sais respecter les délais de livraison.	1	t
89	Je sais organiser le transport ou la logistique d'un événement.	1	t
90	Je sais accueillir et encadrer un stagiaire.	1	t
91	Je sais rédiger une offre d'emploi ou une fiche de poste.	1	t
92	Je sais mener un entretien de recrutement.	1	t
93	Je sais évaluer les compétences d'un candidat.	1	t
94	Je sais gérer un conflit au sein d'une équipe.	1	t
95	Je sais construire un planning d'équipe.	1	t
96	Je sais préparer une présentation avec des supports visuels clairs.	1	t
97	Je sais synthétiser une information complexe pour la rendre accessible.	1	t
98	Je sais respecter l'environnement dans mes pratiques professionnelles.	1	t
99	Je sais proposer des idées innovantes pour améliorer un processus.	1	t
100	Je sais m'adapter à une nouvelle réglementation dans mon secteur.	1	t
\.


--
-- Data for Name: recruiter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recruiter (id, "companyName", "userId") FROM stdin;
12	OuestTech Recrutement	4b3da8b3-d5b9-46f8-8565-ca604cdea3ef
\.


--
-- Data for Name: seeker; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seeker (id, name, lastname, certification, video, "userId", "videoStatus", "videoRejectionReason", "videoModeratedAt", "videoModeratedBy") FROM stdin;
16	Jeremie	Moulin	f	https://youtube.com/watch?v=ttaDZyPm608	749d510b-6248-4a8e-9cfb-0deb9c74b4f6	pending	\N	\N	\N
13	Etienne	de la Fontaine	t	https://youtube.com/watch?v=UwMmKYR7sEs	109ba1c5-54b8-4e0c-8755-b5f4d06c1294	approved	\N	2026-09-03 08:18:54.725	db44cb77-c1d3-4afa-bd84-f1cd69169c2c
14	Tanguy	Brague	t	https://youtube.com/watch?v=OcWfOgs_0Zk	680bbc07-055b-4f30-b1ab-7c23187b6c4d	approved	\N	2026-09-03 08:18:54.748	db44cb77-c1d3-4afa-bd84-f1cd69169c2c
15	Georges	Ansquer	t	https://youtube.com/watch?v=_lGKG15E-jI	f4fa1b10-15df-4a5e-9ef5-9313552df325	approved	\N	2026-09-03 08:18:54.766	db44cb77-c1d3-4afa-bd84-f1cd69169c2c
17	Benjamin	Croizet	t	https://www.youtube.com/watch?v=InMcm5gqHUs	97ee1332-00e0-407f-99e9-0f9246f160fa	approved	\N	2026-09-03 08:19:34.633	db44cb77-c1d3-4afa-bd84-f1cd69169c2c
\.


--
-- Data for Name: seeker_activity_sectors_activity_sector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seeker_activity_sectors_activity_sector ("seekerId", "activitySectorId") FROM stdin;
13	1
14	1
15	1
16	1
17	1
\.


--
-- Data for Name: seeker_competences_competence; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seeker_competences_competence ("seekerId", "competenceId") FROM stdin;
13	16
13	19
14	17
14	20
15	3
15	18
16	14
16	16
17	16
17	18
\.


--
-- Data for Name: seeker_localisations_localisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seeker_localisations_localisation ("seekerId", "localisationId") FROM stdin;
13	1
14	1
15	1
16	1
17	1
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, email, password, role, "birthDate") FROM stdin;
db44cb77-c1d3-4afa-bd84-f1cd69169c2c	admin@job-et-bonheur.fr	$2b$10$Nero2pxoGw/5mEvOQRUQb.8lSxZ2SZ2zbtodeP.QM.9gjrcFXFP5.	admin	1985-01-01
109ba1c5-54b8-4e0c-8755-b5f4d06c1294	etienne.delafontaine@jibjob-demo.fr	$2b$10$kxjzSGUgayMo8gPI.U8Vuurm2I/67bcu8f6dLeK3CMfNBnB7WrUNW	seeker	1996-03-12
680bbc07-055b-4f30-b1ab-7c23187b6c4d	tanguy.brague@jibjob-demo.fr	$2b$10$3kNE.CxkoRLuxtOUwl83L.S0CsUlvIa5yDqFQRd.6ao03zyKQdGKG	seeker	1994-07-22
f4fa1b10-15df-4a5e-9ef5-9313552df325	georges.ansquer@jibjob-demo.fr	$2b$10$r6/6Wnj5nIxEIhV6oMI85.ilGS4Ds37ohVwui3PE71kPX0cAXfDNu	seeker	1990-11-05
749d510b-6248-4a8e-9cfb-0deb9c74b4f6	jeremie.moulin@jibjob-demo.fr	$2b$10$wwKxdm3bTeTd3y8s1J/GjucXpMN.E7wzgujt1dP6mkvxMwrnM4.aK	seeker	1998-01-30
4b3da8b3-d5b9-46f8-8565-ca604cdea3ef	contact@ouesttech-recrutement.fr	$2b$10$Z8rB5lgUtRhrT0F7dwzPhurHyxE16UwODms3icHkA7y8Iywewk4Um	recruiter	1985-05-14
97ee1332-00e0-407f-99e9-0f9246f160fa	benjamin.croizet@jibjob-demo.fr	$2b$10$UXcMK9EhzXNynUpexAv7W.u3TUAMn/ZfeYKkMVDekTckTJRXSzomG	seeker	1993-09-18
\.


--
-- Name: activity_sector_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_sector_id_seq', 15, true);


--
-- Name: answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.answer_id_seq', 625, true);


--
-- Name: attempt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attempt_id_seq', 14, true);


--
-- Name: competence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.competence_id_seq', 30, true);


--
-- Name: interaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.interaction_id_seq', 58, true);


--
-- Name: localisation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.localisation_id_seq', 1, true);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.message_id_seq', 16, true);


--
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.question_id_seq', 100, true);


--
-- Name: recruiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recruiter_id_seq', 12, true);


--
-- Name: seeker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seeker_id_seq', 18, true);


--
-- Name: question PK_21e5786aa0ea704ae185a79b2d5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY (id);


--
-- Name: localisation PK_296b44eea08ff6807f4430650dd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localisation
    ADD CONSTRAINT "PK_296b44eea08ff6807f4430650dd" PRIMARY KEY (id);


--
-- Name: seeker PK_40c70b62e7b0087bdd3f383ed3b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker
    ADD CONSTRAINT "PK_40c70b62e7b0087bdd3f383ed3b" PRIMARY KEY (id);


--
-- Name: attempt PK_5f822b29b3128d1c65d3d6c193d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY (id);


--
-- Name: activity_sector PK_77933457dfcb2f851c75a36a370; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_sector
    ADD CONSTRAINT "PK_77933457dfcb2f851c75a36a370" PRIMARY KEY (id);


--
-- Name: interaction PK_9204371ccb2c9dab5428b406413; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction
    ADD CONSTRAINT "PK_9204371ccb2c9dab5428b406413" PRIMARY KEY (id);


--
-- Name: answer PK_9232db17b63fb1e94f97e5c224f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY (id);


--
-- Name: seeker_activity_sectors_activity_sector PK_969c119c3f9f3e3b9789e0a4820; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_activity_sectors_activity_sector
    ADD CONSTRAINT "PK_969c119c3f9f3e3b9789e0a4820" PRIMARY KEY ("seekerId", "activitySectorId");


--
-- Name: competence PK_994109fe84a82508e174282df03; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competence
    ADD CONSTRAINT "PK_994109fe84a82508e174282df03" PRIMARY KEY (id);


--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: recruiter PK_e10c71ef86a9be2a6aead8eadfa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter
    ADD CONSTRAINT "PK_e10c71ef86a9be2a6aead8eadfa" PRIMARY KEY (id);


--
-- Name: seeker_competences_competence PK_ebc6582f8f44686f4001aabc9f0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_competences_competence
    ADD CONSTRAINT "PK_ebc6582f8f44686f4001aabc9f0" PRIMARY KEY ("seekerId", "competenceId");


--
-- Name: seeker_localisations_localisation PK_f5273b9bd9b1f79cdfa46aea74b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_localisations_localisation
    ADD CONSTRAINT "PK_f5273b9bd9b1f79cdfa46aea74b" PRIMARY KEY ("seekerId", "localisationId");


--
-- Name: seeker REL_20bb01672b489f23ffb33c07ca; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker
    ADD CONSTRAINT "REL_20bb01672b489f23ffb33c07ca" UNIQUE ("userId");


--
-- Name: attempt REL_8b8b24e4c2628a54eb63aa4993; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "REL_8b8b24e4c2628a54eb63aa4993" UNIQUE ("seekerId");


--
-- Name: recruiter REL_a6593fa02ecf157f2161490527; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter
    ADD CONSTRAINT "REL_a6593fa02ecf157f2161490527" UNIQUE ("userId");


--
-- Name: answer UQ_2bb018677c5d400e8182c5a5c55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT "UQ_2bb018677c5d400e8182c5a5c55" UNIQUE ("attemptId", "questionId");


--
-- Name: competence UQ_4822e533d67e697686158841915; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competence
    ADD CONSTRAINT "UQ_4822e533d67e697686158841915" UNIQUE (competence);


--
-- Name: activity_sector UQ_6a3cd68b31260d18cb795aea6cd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_sector
    ADD CONSTRAINT "UQ_6a3cd68b31260d18cb795aea6cd" UNIQUE ("activitySector");


--
-- Name: localisation UQ_7adf5a424601021fd48dfc9f732; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localisation
    ADD CONSTRAINT "UQ_7adf5a424601021fd48dfc9f732" UNIQUE (localisation);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_0d7df468a4255b2d82ec9983dd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_0d7df468a4255b2d82ec9983dd" ON public.seeker_activity_sectors_activity_sector USING btree ("activitySectorId");


--
-- Name: IDX_1883505acd057fe532500c4e76; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_1883505acd057fe532500c4e76" ON public.seeker_localisations_localisation USING btree ("seekerId");


--
-- Name: IDX_341fdf829b5cc9e1959da6114f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_341fdf829b5cc9e1959da6114f" ON public.seeker_localisations_localisation USING btree ("localisationId");


--
-- Name: IDX_41ca1f49921487c28a278918fe; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_41ca1f49921487c28a278918fe" ON public.seeker_competences_competence USING btree ("competenceId");


--
-- Name: IDX_7f0aa557ac1cfff3fd8704606a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_7f0aa557ac1cfff3fd8704606a" ON public.seeker_competences_competence USING btree ("seekerId");


--
-- Name: IDX_fbf4bd024586a328d270739f21; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fbf4bd024586a328d270739f21" ON public.seeker_activity_sectors_activity_sector USING btree ("seekerId");


--
-- Name: seeker_activity_sectors_activity_sector FK_0d7df468a4255b2d82ec9983dd4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_activity_sectors_activity_sector
    ADD CONSTRAINT "FK_0d7df468a4255b2d82ec9983dd4" FOREIGN KEY ("activitySectorId") REFERENCES public.activity_sector(id);


--
-- Name: seeker_localisations_localisation FK_1883505acd057fe532500c4e76c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_localisations_localisation
    ADD CONSTRAINT "FK_1883505acd057fe532500c4e76c" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message FK_1f98475af6bf73abaa384668ccf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_1f98475af6bf73abaa384668ccf" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON DELETE CASCADE;


--
-- Name: seeker FK_20bb01672b489f23ffb33c07ca3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker
    ADD CONSTRAINT "FK_20bb01672b489f23ffb33c07ca3" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: seeker_localisations_localisation FK_341fdf829b5cc9e1959da6114f6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_localisations_localisation
    ADD CONSTRAINT "FK_341fdf829b5cc9e1959da6114f6" FOREIGN KEY ("localisationId") REFERENCES public.localisation(id);


--
-- Name: seeker_competences_competence FK_41ca1f49921487c28a278918fe8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_competences_competence
    ADD CONSTRAINT "FK_41ca1f49921487c28a278918fe8" FOREIGN KEY ("competenceId") REFERENCES public.competence(id);


--
-- Name: interaction FK_4cdaa54caf1c0b605b5cbc44f3e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction
    ADD CONSTRAINT "FK_4cdaa54caf1c0b605b5cbc44f3e" FOREIGN KEY ("recruiterId") REFERENCES public.recruiter(id) ON DELETE CASCADE;


--
-- Name: seeker_competences_competence FK_7f0aa557ac1cfff3fd8704606a0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_competences_competence
    ADD CONSTRAINT "FK_7f0aa557ac1cfff3fd8704606a0" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: interaction FK_7f968db0c045dd92176e61fd57e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction
    ADD CONSTRAINT "FK_7f968db0c045dd92176e61fd57e" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON DELETE CASCADE;


--
-- Name: attempt FK_8b8b24e4c2628a54eb63aa49933; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "FK_8b8b24e4c2628a54eb63aa49933" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON DELETE CASCADE;


--
-- Name: answer FK_a4013f10cd6924793fbd5f0d637; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES public.question(id) ON DELETE RESTRICT;


--
-- Name: message FK_a429d598a14ab11130a6c387920; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_a429d598a14ab11130a6c387920" FOREIGN KEY ("recruiterId") REFERENCES public.recruiter(id) ON DELETE CASCADE;


--
-- Name: recruiter FK_a6593fa02ecf157f21614905275; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter
    ADD CONSTRAINT "FK_a6593fa02ecf157f21614905275" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: answer FK_df3b92aa295640d070922ebc382; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT "FK_df3b92aa295640d070922ebc382" FOREIGN KEY ("attemptId") REFERENCES public.attempt(id) ON DELETE CASCADE;


--
-- Name: seeker_activity_sectors_activity_sector FK_fbf4bd024586a328d270739f214; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeker_activity_sectors_activity_sector
    ADD CONSTRAINT "FK_fbf4bd024586a328d270739f214" FOREIGN KEY ("seekerId") REFERENCES public.seeker(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


