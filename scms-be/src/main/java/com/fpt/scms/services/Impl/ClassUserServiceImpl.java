package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.ClassUserDTO;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.repository.*;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.ClassUserService;
import com.fpt.scms.services.TeamService;
import com.fpt.scms.services.UserService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class ClassUserServiceImpl implements ClassUserService {
    private static final Logger log = LoggerFactory.getLogger(ClassUserServiceImpl.class);
    @Autowired
    private ClassUserRepository classUserRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    SemesterRepository semesterRepository;
    ModelMapper modelMapper = new ModelMapper();

    @Override
    public int getCountTotalUser( Long classId) {
        return classUserRepository.countByClassId(classId);
    }

//    @Override
//    public List<ClassUserDTO> getAllClassUser( Long classId) {
//        List<ClassUserDTO> classUsers = classUserRepository.getAllByClassId(classId);
//        return classUsers.stream()
//                .map(classUser -> modelMapper.map(classUser, ClassUserDTO.class))
//                .collect(Collectors.toList());
//    }

    @Override
    public List<ClassUserDTO> getAllClassUserForStudent( Long classId, Long studentId) {
        Team team = teamRepository.findByStudentId(studentId, classId);
        List<ClassUserDTO> classUsers = classUserRepository.getAllByClassIdAndTeam(classId, team.getTeamId());
        return classUsers.stream()
                .map(classUser -> modelMapper.map(classUser, ClassUserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassUserDTO> getAllClassUserFilter(Long semesterId, Long classId, Long teamId) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        List<ClassUserDTO> classUsers = classUserRepository.getAllBySemesterIdClassIdTeamId(semesterId,classId,teamId, currentUser.getUserId());
        return classUsers.stream()
                .map(classUser -> modelMapper.map(classUser, ClassUserDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public List<ClassUserDTO> getAllClassUserFilterForReviewer(Long semesterId, Long classId, Long teamId) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        List<ClassUserDTO> classUsers = classUserRepository.getAllBySemesterIdClassIdTeamIdAndReviewer(semesterId,classId,teamId, currentUser.getUserId());
        return classUsers.stream()
                .map(classUser -> modelMapper.map(classUser, ClassUserDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public ClassUserDTO create(ClassUserDTO classUserDTO) {
        ClassUser classUser = modelMapper.map(classUserDTO, ClassUser.class);
        classUserRepository.save(classUser);
        return classUserDTO;
    }

    @Override
    public void importFromExcel(MultipartFile file, Long classId) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row fifthRow = sheet.getRow(4);
            String formatFile = fifthRow.getCell(0).getStringCellValue() + " " + fifthRow.getCell(1).getStringCellValue() + " "
                    + fifthRow.getCell(2).getStringCellValue() + " " + fifthRow.getCell(3).getStringCellValue() +" " + fifthRow.getCell(4).getStringCellValue();
            log.error(formatFile);
            if (!"No Student_roll_number Student_name Email Team".equals(formatFile)) {
                throw new RuntimeException("Your file uploaded has the wrong format");
            }
            int firstDataRowIndex = 5;
            for (int i = firstDataRowIndex; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row.getCell(1) == null || row.getCell(1).getStringCellValue().trim().isEmpty()) {
                    break;
                }
                Cell cellStudent_roll_number = row.getCell(1);
                Cell cellStudent_Name = row.getCell(2);
                Cell cellEmail = row.getCell(3);
                Cell cellTeam = row.getCell(4);
                ClassUser existingClassUser = classUserRepository.findClassUserExist(classId, String.valueOf(cellEmail));
                if (existingClassUser == null) {
                    ClassUserDTO classUserDTO = getClassUserDTO(cellStudent_roll_number, cellStudent_Name, cellEmail, cellTeam, classId);
                    try {
                        create(classUserDTO);
                    } catch (RuntimeException ignored) {
                    }
                } else {
                    log.error("ClassUser already exists: " + existingClassUser.getUserId().getFullName());
                }
//                ClassUserDTO classUserDTO = getClassUserDTO(cellStudent_roll_number,cellStudent_Name,cellEmail, cellTeam,classId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import data from Excel file: " + e.getMessage());
        }
    }
    private ClassUserDTO getClassUserDTO(Cell cellStudent_roll_number, Cell cellStudent_Name, Cell cellEmail, Cell cellTeam, Long classId) {
        String rollNumber = getStringValue(cellStudent_roll_number);
        String studentName = getStringValue(cellStudent_Name);
        String email = getStringValue(cellEmail);
        String teamName = getStringValue(cellTeam);
        Team team = teamService.createTeamForImport(teamName, classId);
        User user = userService.createUserForImport(rollNumber, studentName, email);
        ClassUserDTO classUserDTO = new ClassUserDTO();
        classUserDTO.setUserId(user.getUserId());
        classUserDTO.setRollNumber(rollNumber);
        classUserDTO.setStudentName(studentName);
        classUserDTO.setTeamId(team.getTeamId());
        classUserDTO.setClassId(classId);
        classUserDTO.setStatus("ACTIVE");

        log.error(rollNumber + " " + studentName + " " + teamName);
        return classUserDTO;
    }
    private String getStringValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return "";
        }
    }

    @Override
    public List<ClassUserDTO> getClassForStudent(Long id) {
        return  classUserRepository.findClassByStudentId(id)
                .stream()
                .map(classUserDTO -> modelMapper.map(classUserDTO, ClassUserDTO.class))
                .collect(Collectors.toList());

    }
    @Override
    public ClassUser getClassUserById(Long classUserId) {
        return classUserRepository.findById(classUserId).orElse(null);
    }

    @Override
    @Transactional
    public void deleteSelectedClassUsers(List<Long> classUserIds) {
        if (classUserIds != null && !classUserIds.isEmpty()) {
            classUserRepository.deleteAllByClassUserIdIn(classUserIds);
        }
    }

    @Override
    public int updateFinalPresEvalByTeamId(float finalPresEval, Long teamId) {
        return classUserRepository.updateFinalPresEvalByTeamId(finalPresEval, teamId);
    }

    @Override
    public int updateFinalPresentationResitByTeamId(float finalPresentationResit, Long teamId) {
        return classUserRepository.updateFinalPresentationResitByTeamId(finalPresentationResit, teamId);
    }
    @Override
    public byte[] exportClassUserGradesToExcel(Long classId) {
        List<ClassUser> classUsers = classUserRepository.findAllByClassId_ClassId(classId);
        boolean[] includeOngoingEval = new boolean[6];

        // Check if any student has a non-null value for each ongoing evaluation
        for (ClassUser classUser : classUsers) {
            if (classUser == null) {
                log.warn("Encountered null ClassUser object");
                continue;
            }
            if (classUser.getOngoingEval1() != null) includeOngoingEval[0] = true;
            if (classUser.getOngoingEval2() != null) includeOngoingEval[1] = true;
            if (classUser.getOngoingEval3() != null) includeOngoingEval[2] = true;
            if (classUser.getOngoingEval4() != null) includeOngoingEval[3] = true;
            if (classUser.getOngoingEval5() != null) includeOngoingEval[4] = true;
            if (classUser.getOngoingEval6() != null) includeOngoingEval[5] = true;
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet("Class Users Grades");
            CellStyle passStyle = workbook.createCellStyle();
            Font passFont = workbook.createFont();
            passFont.setColor(IndexedColors.GREEN.getIndex());
            passStyle.setFont(passFont);

            CellStyle failStyle = workbook.createCellStyle();
            Font failFont = workbook.createFont();
            failFont.setColor(IndexedColors.RED.getIndex());
            failStyle.setFont(failFont);
            // Create header row
            Row header = sheet.createRow(0);
            String[] headers = {"No",
                    "Student Name",
                    "Roll Number",
                    "Ongoing 1",
                    "Ongoing 2",
                    "Ongoing 3",
                    "Ongoing 4",
                    "Ongoing 5",
                    "Ongoing 6",
                    "Total Ongoing",
                    "Final Presentation",
                    "Final Presentation Resit",
                    "Final Grade",
                    "Status"
            };
            int colNum = 0;
            for (int i = 0; i < headers.length; i++) {
                // Skip headers for ongoing that are all null
                if (i >= 3 && i <= 8 && !includeOngoingEval[i - 3]) continue;
                header.createCell(colNum++).setCellValue(headers[i]);
            }

            // Fill data
            int rowNum = 1;
            for (ClassUser classUser : classUsers) {
                Row row = sheet.createRow(rowNum++);
                colNum = 0;
                row.createCell(colNum++).setCellValue(rowNum - 1);
                row.createCell(colNum++).setCellValue(classUser.getUserId().getFullName());
                row.createCell(colNum++).setCellValue(classUser.getUserId().getRollNumber());
                // Add data for each ongoing eval only if it's included
                for (int i = 0; i < 6; i++) {
                    if (includeOngoingEval[i]) {
                        Double evalValue = null;
                        switch (i) {
                            case 0: evalValue = classUser.getOngoingEval1(); break;
                            case 1: evalValue = classUser.getOngoingEval2(); break;
                            case 2: evalValue = classUser.getOngoingEval3(); break;
                            case 3: evalValue = classUser.getOngoingEval4(); break;
                            case 4: evalValue = classUser.getOngoingEval5(); break;
                            case 5: evalValue = classUser.getOngoingEval6(); break;
                        }
                        row.createCell(colNum++).setCellValue(evalValue != null ? evalValue.toString() : "N/A");
                    }
                }

                setCellValueOrNA(row, colNum++, classUser.getTotalOngoingEval());
                setCellValueOrNA(row, colNum++, classUser.getFinalPresEval());
                setCellValueOrNA(row, colNum++, classUser.getFinalPresentationResit());
                setCellValueOrNA(row, colNum++, classUser.getFinalGrade());
                Cell statusCell = row.createCell(colNum++);
                String passStatus = classUser.getPassStatus();
                statusCell.setCellValue(passStatus);

                if ("PASSED".equals(passStatus)) {
                    statusCell.setCellStyle(passStyle);
                } else {
                    statusCell.setCellStyle(failStyle);
                }
            }


            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to Excel file: " + e.getMessage());
        }
    }

    private void setCellValueOrNA(Row row, int colIndex, Double value) {
        row.createCell(colIndex).setCellValue(value != null ? value.toString() : "N/A");
    }

    @Override
    public void calculateAndUpdateFinalGrades(Long classId) {
        List<ClassUser> classUsers = classUserRepository.findAllByClassId_ClassId(classId);
        if (classUsers == null || classUsers.isEmpty()) {
            throw new RuntimeException("No class users found for class ID: " + classId);
        }

        // Check if any ClassUser has a null totalOngoingEval
//        boolean allHaveTotalOngoingEval = classUsers.stream()
//                .allMatch(user -> user.getTotalOngoingEval() != null);

//        if (!allHaveTotalOngoingEval) {
//            throw new RuntimeException("Cannot update final grades: One or more student is not grading yet!");
//        }
        String passStatus;
        for (ClassUser classUser : classUsers) {
            Double finalGrade = calculateFinalGrade(classUser);
            classUser.setFinalGrade(finalGrade);
            Semester semester = semesterRepository.findBy(classUser.getClassId().getSemester().getSemesterId());
            if (finalGrade >= semester.getMinFinal() && Objects.equals(classUser.getUserNotes().trim().toUpperCase(), "YES")){
                passStatus ="PASSED";
            }else{
                passStatus ="NOT PASSED";
            }
            classUser.setPassStatus(passStatus);
            classUser.setIsSubmited("YES");
            classUserRepository.save(classUser);
        }
    }

    @Override
    public List<Map<String, Object>> getPassFailData(int year) {
        return classUserRepository.countPassedAndNotPassedStudentsByYear(year);
    }


    private Double calculateFinalGrade(ClassUser classUser) {
        Double finalPresEval = classUser.getFinalPresEval();
        Double finalPresentationResit = classUser.getFinalPresentationResit();
        Double totalOngoingEval = classUser.getTotalOngoingEval();
        Semester currentSemester = semesterRepository.findActiveSemester()
                .orElseThrow(() -> new RuntimeException("Semester not found"));
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository
                .findEvaluationCriteriaBySemesterId(currentSemester.getSemesterId());
        double finalWeight = evaluationCriteria.getFinalWeight()/100;
        if (finalPresentationResit != null && totalOngoingEval != null) {
            return finalPresentationResit * finalWeight + totalOngoingEval * (1-finalWeight);
        } else if (finalPresEval != null && totalOngoingEval != null) {
            return finalPresEval *   finalWeight + totalOngoingEval * (1-finalWeight);
        } else {
            return  0.0;
        }
    }
}
