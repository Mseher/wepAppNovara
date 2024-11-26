-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2024 at 12:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `novara`
--

-- --------------------------------------------------------

--
-- Table structure for table `institutions`
--

CREATE TABLE `institutions` (
  `ID` int(11) NOT NULL,
  `INSTITUTION_NAME` varchar(81) DEFAULT NULL,
  `MAIN_PLACE` varchar(30) DEFAULT NULL,
  `PLACE` varchar(17) DEFAULT NULL,
  `DIRECTOR` varchar(33) DEFAULT NULL,
  `FOUNDATION_DATE` varchar(15) DEFAULT NULL,
  `NATURE` varchar(40) DEFAULT NULL,
  `REFERENCE` varchar(19) DEFAULT NULL,
  `COORDINATES` varchar(40) DEFAULT NULL,
  `REFERENCES` varchar(222) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `institutions`
--

INSERT INTO `institutions` (`ID`, `INSTITUTION_NAME`, `MAIN_PLACE`, `PLACE`, `DIRECTOR`, `FOUNDATION_DATE`, `NATURE`, `REFERENCE`, `COORDINATES`, `REFERENCES`, `latitude`, `longitude`) VALUES
(1, 'Germania', 'RIO DE JANEIRO', 'Rio de Janeiro', '', '1821', 'reading society and general conviviality', 'I, 108', 'NAN,NAN', '', 0, 0),
(2, 'Madras Literary Society', 'MADRAS', 'Madras', '', '', '', 'I, 286', 'NAN,NAN', '', 0, 0),
(3, 'Natuurkundige Vereeniging', 'BATAVIA', 'Batavia', 'Dr. Bleeker', '1850', '', 'II, 111', 'NAN,NAN', '', 0, 0),
(4, 'Vereeniging tot bevordering der geneeskundige Wetenschappen in\nNederlandsch Indie', 'BATAVIA', 'Batavia', 'Dott. G. Wassink', '', '', 'II, 111', 'NAN,NAN', '', 0, 0),
(5, 'Bataviaasch Genootschap van Kunsten en Wetenschappen', 'BATAVIA', 'Batavia', '', '1778', '', 'II, 111', 'NAN,NAN', 'https://en.wikipedia.org/wiki/Royal_Batavian_Society_of_Arts_and_Sciences', 0, 0),
(6, 'Hospital of San Juan de Dios', 'MANILA', 'Manila', '', '', '', '', 'NAN,NAN', '', 0, 0),
(7, 'Biblioteca Militar', 'MANILA', 'Manila', '', '', '', '', 'NAN,NAN', '', 0, 0),
(8, 'Civil Hospital', 'MANILA', 'Manila', '', '', '', '', 'NAN,NAN', '', 0, 0),
(9, 'Poor House', 'MANILA', 'Manila', '', '', '', '', 'NAN,NAN', '', 0, 0),
(10, 'China Branch of the\nRoyal Asiatic Society', 'HONG KONG', 'Hong Kong', '', '', '', '', 'NAN,NAN', '', 0, 0),
(11, 'Imperial Cabinet of Antiquities', 'VIENNA', 'Vienna', '', '', '', '', 'NAN,NAN', '', 0, 0),
(12, 'Männergesangvereine in\nShanghai', 'SHANGHAI', 'Shanghai', '', '', '', '', 'NAN,NAN', '', 0, 0),
(13, 'Kaiserlich-Königliche Hofbibliothek', 'VIENNA', 'Vienna', '', '', '', '', 'NAN,NAN', '', 0, 0),
(14, 'ÖAW – Österreichische Akademie der Wissenschaften', 'VIENNA', 'Vienna', '', '', '', '', 'NAN,NAN', '', 0, 0),
(15, 'Österreichische Nationalbibliothek', 'VIENNA', 'Vienna', '', '', '', '', '48.20653257978137, 16.36693821226425', 'https://www.onb.ac.at/ ', 48.20653257978137, 16.36693821226425),
(16, 'Biblioteca Civica Attilio Hortis, Trieste', 'TRIEST', 'Trieste', '', '', '', '', '45.646995953322474, 13.767765317280492', ' https://bibliotecacivicahortis.it/ ', 45.646995953322474, 13.767765317280492),
(17, 'Casa dos Editores Proprietarios\nEduardo e Henrique Laemmert', 'RIO DE JANEIRO', 'Rio de Janeiro', 'Eduard Laemmert\nHenrich Laemmert ', '1838', 'publisher', 'I, 133-134', '-22.902784658070228, -43.177115004200616', 'https://pt.wikipedia.org/wiki/Tipografia_Universal', -22.902784658070228, -43.177115004200616),
(18, 'Consular Office of the Austrian Imperial Ministry of Commerce', 'MELBOURNE (COLONY OF VICTORIA)', 'Victoria', '', '', '', '', 'NAN,NAN', '', 0, 0),
(19, 'London Missionary Society – Shanghai branch', 'SHANGHAI', 'Shanghai', '', '', '', '', 'NAN,NAN', 'https://www.nla.gov.au/collections/guide-selected-collections/london-missionary-society-collection ', 0, 0),
(20, 'Chinese Evangelisation Society', 'MELBOURNE (COLONY OF VICTORIA)', 'Victoria', '', '', '', '', 'NAN,NAN', '', 0, 0),
(21, 'Samuel Wells Williams (Press)', 'MACAU', 'Macau', '', '', '', '', 'NAN,NAN', ' https://www.jstor.org/stable/196363?seq=1 ', 0, 0),
(22, 'London Missionary Society – Hong Kong branch', 'MELBOURNE (COLONY OF VICTORIA)', 'Victoria', '', '', '', '', '22.28352715475685, 114.14690186397827', '', 22.28352715475685, 114.14690186397827),
(23, 'Government House of Chile – La Moneda', 'SANTIAGO (CHILE)', 'Santiago', '', '', '', '', '-33.44226968841936, -70.65393304431521', '', -33.44226968841936, -70.65393304431521),
(24, 'Instituto Histórico e Geográfico Brasileiro', 'RIO DE JANEIRO', 'Rio de Janeiro', '', '1838', 'scientific academy', 'I, 145', '-22.90337898909085, -43.17425889325277', 'https://brasilianafotografica.bn.gov.br/?page_id=36678\n \nhttps://www.ihgb.org.br/ \n\nhttps://pt.wikipedia.org/wiki/Instituto_Hist%C3%B3rico_e_Geogr%C3%A1fico_Brasileiro ', -22.90337898909085, -43.17425889325277),
(25, 'Imperial Academia de Belas Artes', 'RIO DE JANEIRO', 'Rio de Janeiro', '', '', '', 'I, 140', 'NAN,NAN', '', 0, 0),
(26, 'Moravian Brothers Mission', 'CAPE COLONY', 'Genadental', '', '', '', 'I, 234-241', '-34.03414864810641, 19.55775602362826', '', -34.03414864810641, 19.55775602362826),
(27, 'London Missionary Society – Cape of Good Hope branch', 'CAPE COLONY', 'Cape of Good Hope', '', '1799', '', 'I, 255', 'NAN,NAN', 'https://www.sahistory.org.za/archive/role-missionaries-conquest-chapter-ii-functions-missionary \n\nhttps://archives.soas.ac.uk/records/CWM/LMS/04/14/009a ', 0, 0),
(28, 'Catholic Mission of San Sebastian de Makùn', 'MANILA', 'Bentotte', '', '', '', 'I, 369-370, 397-399', 'NAN,NAN', '', 0, 0),
(29, 'Santo Domingo Convent and Church Intramuros', 'MANILA', 'Manila', '', '1588', 'convent and church', 'II, 302-303', '14.593415157898178, 120.97484762024169', 'https://laydominicansph.weebly.com/dominicansphilippines.html \n\nhttps://www.hmdb.org/m.asp?m=25287 \n\nhttps://collections.leventhalmap.org/search/commonwealth:kh04p668h ', 14.593415157898178, 120.97484762024169),
(30, ' San Agustín Convent and Church Intramuros', 'MANILA', 'Manila', '', '1607', 'convent and church', 'II, 299', '14.588889, 120.975278', 'https://augustiniansphilippines.net/osa_resources/augustinians-in-the-philippines-1565-1898/ \n\nhttps://en.wikipedia.org/wiki/San_Agustin_Church_(Manila) \n\nhttps://collections.leventhalmap.org/search/commonwealth:kh04p668h ', 14.588889, 120.975278),
(31, 'San Francisco Convent and Church Intramuros', 'MANILA', 'Manila', '', '1578', 'convent and church', 'II, 303', '14.591192, 120.978333', 'https://en.wikipedia.org/wiki/San_Francisco_Church_(Manila) \n\nhttps://www.hmdb.org/m.asp?m=25236 \n\nhttps://collections.leventhalmap.org/search/commonwealth:kh04p668h ', 14.591192, 120.978333),
(32, 'St. Thomas University', 'MANILA', 'Manila', '', '1611', 'university', 'II, 303', '14.593639319493812, 120.97411229938078', 'https://collections.leventhalmap.org/search/commonwealth:kh04p668h ', 14.593639319493812, 120.97411229938078),
(33, 'Colegio Máximo de San Ignacio ', 'MANILA', 'Manila', '', '1590', '', '', '14.588146106232479, 120.97708750671161', 'https://collections.leventhalmap.org/search/commonwealth:kh04p668h \n\nhttp://pares.mcu.es/ParesBusquedas20/catalogo/description/12960481 ', 14.588146106232479, 120.97708750671161),
(34, 'Convent and Church of the Recoletos, \nor Reformed Augustinians', 'MANILA', 'Manila', '', '', 'convent and church', 'II, 304', '14.58813607244944, 120.97815053782874', 'https://collections.leventhalmap.org/search/commonwealth:kh04p668h ', 14.58813607244944, 120.97815053782874),
(35, 'Livraria B. L. Garnier', 'RIO DE JANEIRO', 'Rio de Janeiro', 'Baptiste Louis Garnier', '1844', 'publisher', '/', '-22.90244265875865, -43.1765857822063', 'https://www.onb.ac.at/mehr/blogs/detail/die-buecherkaeufe-in-rio-de-janeiro \n\nhttps://pt.wikipedia.org/wiki/Livraria_Garnier ', -22.90244265875865, -43.1765857822063);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `institutions`
--
ALTER TABLE `institutions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
