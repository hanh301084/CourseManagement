package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.IsBlock5;
import com.fpt.scms.model.dto.*;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.repository.*;
import com.fpt.scms.services.ClassUserService;
import com.fpt.scms.services.PackageEvaluationService;
import com.fpt.scms.services.ProjectBacklogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

@Service
public class PackageEvaluationServiceImpl implements PackageEvaluationService {
    @Autowired
    private PackageEvaluationRepository packageEvaluationRepository;
    @Autowired
    private ClassUserRepository classUserRepository;
    @Autowired
    private EvaluationCriteriaServiceImpl evaluationCriteriaService;
    @Autowired
    private ClassUserService classUserService;
    @Autowired
    private ProjectBacklogService projectBacklogService;
    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    SettingRepository settingRepository;
    @Autowired
    SemesterRepository semesterRepository;

    @Override
    public List<PackageEvaluation> getAllEvaluationCriteria(Long semesterId) {
        return null;
    }

    @Override
    public void updateIterationWeights(List<PackageEvaluationDTO> packageEvaluationDTOS) {

    }


    @Override
    public void updatePackageEvaluationOG(OngoingDataDTO ongoingDataDTO) {

        EvaluationCriteria evaluationCriteria = evaluationCriteriaService
                .getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(),
                        ongoingDataDTO.getClassType(),
                        ongoingDataDTO.getIterationName());
        PackageEvaluation existingPackageEvaluation = packageEvaluationRepository
                .findByClassUserIdAndCriteriaId(ongoingDataDTO.getClassUserId(), evaluationCriteria.getCriteriaId());
        ClassUser classUser = classUserService.getClassUserById(ongoingDataDTO.getClassUserId());
        ClassUser classUserLoc = classUserRepository.findByClassUserId(ongoingDataDTO.getClassUserId());
        TotalLocProjectBacklogDTO totalLocProjectBacklogDTO = projectBacklogService.getTotalLocIter(classUserLoc.getTeamId().getTeamId(), classUserLoc.getUserId().getUserId());
        if (existingPackageEvaluation != null) {
            if (ongoingDataDTO.getIterationName().equals("Iteration 1")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter1() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter1() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter1() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter1()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }

                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval1(ogGrade);
                classUserRepository.save(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 2")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter2() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter2() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter2() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter2()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval2(ogGrade);
                classUserRepository.save(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 3")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter3() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter3() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter3() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter3()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval3(ogGrade);
                classUserRepository.save(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 4")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter4() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter4() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter4() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter4()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval4(ogGrade);
                classUserRepository.save(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 5")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter5() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter5() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter5() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter5()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval5(ogGrade);
                classUserRepository.save(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 6")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter6() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter6() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                existingPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
                existingPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
                existingPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter6() != null){
                    existingPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter6()));
                }else {
                    existingPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.save(existingPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * existingPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * existingPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval6(ogGrade);
                classUserRepository.save(classUser);
            }
            double og1 = (classUser.getOngoingEval1() != null ? classUser.getOngoingEval1() : 0.0);
            double og2 = (classUser.getOngoingEval2() != null ? classUser.getOngoingEval2() : 0.0);
            double og3 = (classUser.getOngoingEval3() != null ? classUser.getOngoingEval3() : 0.0);
            double og4 = (classUser.getOngoingEval4() != null ? classUser.getOngoingEval4() : 0.0);
            double og5 = (classUser.getOngoingEval5() != null ? classUser.getOngoingEval5() : 0.0);
            double og6 = (classUser.getOngoingEval6() != null ? classUser.getOngoingEval6() : 0.0);
            double weightOg1 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 1"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg2 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 2"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg3 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 3"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg4 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 4"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg5 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 5"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg6 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 6"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double totalOg = (og1 * weightOg1 + og2 * weightOg2 + og3 * weightOg3 + og4 * weightOg4 + og5 * weightOg5 + og6 * weightOg6) / (weightOg1 + weightOg2 + weightOg3 + weightOg4 + weightOg5 + weightOg6);
            classUser.setTotalOngoingEval(totalOg);
        } else {
            PackageEvaluation newPackageEvaluation = new PackageEvaluation();
            newPackageEvaluation.setClassUserId(classUser);
            newPackageEvaluation.setEvaluationCriteria(evaluationCriteria);
            newPackageEvaluation.setSrsGrade(ongoingDataDTO.getSrsGrade());
            newPackageEvaluation.setSdsGrade(ongoingDataDTO.getSdsGrade());
            packageEvaluationRepository.save(newPackageEvaluation);
            if (ongoingDataDTO.getIterationName().equals("Iteration 1")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter1() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter1() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }

                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter1() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter1()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval1(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 2")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter2() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter2() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter2() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter2()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval2(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 3")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter3() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter3() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter3() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter3()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval3(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 4")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter4() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter4() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                if(totalLocProjectBacklogDTO.getSumLocIter4() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter4()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }
                newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter4()));
                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval4(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 5")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter5() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter5() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter5() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter5()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }
                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval5(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            if (ongoingDataDTO.getIterationName().equals("Iteration 6")) {
                double locGrade;
                double maxLoc = evaluationCriteria.getMaxLoc();
                if (totalLocProjectBacklogDTO != null) {
                    if (maxLoc == 0) {
                        locGrade = 0;
                    } else {
                        if (totalLocProjectBacklogDTO.getSumLocIter6() != null) {
                            locGrade = totalLocProjectBacklogDTO.getSumLocIter6() / maxLoc * 10;
                            locGrade = Math.min(locGrade, 10);

                        } else {
                            locGrade = 0;
                        }
                    }
                } else {
                    locGrade = 0;
                }
                newPackageEvaluation.setLocGrade(locGrade);
                assert totalLocProjectBacklogDTO != null;
                if(totalLocProjectBacklogDTO.getSumLocIter6() != null){
                    newPackageEvaluation.setLoc(Double.valueOf(totalLocProjectBacklogDTO.getSumLocIter6()));
                }else {
                    newPackageEvaluation.setLoc(0.0);
                }

                packageEvaluationRepository.saveAndFlush(newPackageEvaluation);
                double ogGrade = (evaluationCriteria.getOngoingSRSWeight() * newPackageEvaluation.getSrsGrade()
                        + evaluationCriteria.getOngoingSDSWeight() * newPackageEvaluation.getSdsGrade()) / 100
                        + evaluationCriteria.getOngoingCodingWeight() / 100 * locGrade;
                classUser.setOngoingEval6(ogGrade);
                classUserRepository.saveAndFlush(classUser);
            }
            double og1 = (classUser.getOngoingEval1() != null ? classUser.getOngoingEval1() : 0.0);
            double og2 = (classUser.getOngoingEval2() != null ? classUser.getOngoingEval2() : 0.0);
            double og3 = (classUser.getOngoingEval3() != null ? classUser.getOngoingEval3() : 0.0);
            double og4 = (classUser.getOngoingEval4() != null ? classUser.getOngoingEval4() : 0.0);
            double og5 = (classUser.getOngoingEval5() != null ? classUser.getOngoingEval5() : 0.0);
            double og6 = (classUser.getOngoingEval6() != null ? classUser.getOngoingEval6() : 0.0);
            double weightOg1 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 1"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg2 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 2"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg3 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 3"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg4 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 4"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg5 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 5"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);
            double weightOg6 = Optional.ofNullable(evaluationCriteriaService.getEvaluationCriteriaCalculate(ongoingDataDTO.getSemesterId(), ongoingDataDTO.getClassType(), "Iteration 6"))
                    .map(EvaluationCriteria::getEvaluationWeight)
                    .orElse(0.0);

            double totalOg = (og1 * weightOg1 + og2 * weightOg2 + og3 * weightOg3 + og4 * weightOg4 + og5 * weightOg5 + og6 * weightOg6) / (weightOg1 + weightOg2 + weightOg3 + weightOg4 + weightOg5 + weightOg6);
            classUser.setTotalOngoingEval(totalOg);

        }
         Semester semester = semesterRepository.findBy(classUser.getClassId().getSemester().getSemesterId());

        if ((classUser.getTotalOngoingEval() != null && classUser.getTotalOngoingEval() < semester.getMinOGTotal())
                || (classUser.getOngoingEval1() != null && classUser.getOngoingEval1() < semester.getMinOG())
                || (classUser.getOngoingEval2() != null && classUser.getOngoingEval2() < semester.getMinOG())
                || (classUser.getOngoingEval3() != null && classUser.getOngoingEval3() < semester.getMinOG())
                || (classUser.getOngoingEval4() != null && classUser.getOngoingEval4() < semester.getMinOG())
                || (classUser.getOngoingEval5() != null && classUser.getOngoingEval5() < semester.getMinOG())
        ){
            classUser.setUserNotes("NO");
        } else {
            classUser.setUserNotes("YES");
        }
        // lock setting if it used
        Setting setting;
        if (classUser.getClassId().getIsBlock5() == IsBlock5.NO) {
            setting = settingRepository.findSettingByTypeIdAndSettingTitle(
                    classUser.getClassId().getSemester().getSemesterId(), com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK10);
        } else {
            setting = settingRepository.findSettingByTypeIdAndSettingTitle(
                    classUser.getClassId().getSemester().getSemesterId(), com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK5);
        }
        setting.setStatus("LOCKED");
        List<EvaluationCriteria> criterias = evaluationCriteriaRepository.findAllBySemester_SemesterId(classUser.getClassId().getSemester().getSemesterId());
        for (EvaluationCriteria criteria : criterias) {
                criteria.setStatus("LOCKED");
        }
        // lock class if it used
        Class clazz = classRepository.findByClassId(classUser.getClassId().getClassId());
        clazz.setIs_use("YES");
        classRepository.save(clazz);
        evaluationCriteriaRepository.saveAll(criterias);
        settingRepository.save(setting);
        classUserRepository.saveAndFlush(classUser);
    }


    @Override
    public double getupdateOgGrade(double ogGrade) {
        return ogGrade;
    }

    @Override
    public PackageEvaluation getPackageWeightByClassUser(Long semesterId, String classType, String iterationName, Long classUserId) {
        EvaluationCriteria evaluationCriteria = evaluationCriteriaService.getEvaluationCriteriaCalculate(semesterId, classType, iterationName);
        return packageEvaluationRepository.findByClassUserIdAndCriteriaId(classUserId, evaluationCriteria.getCriteriaId());
    }

    @Override
    public List<PackageEvaluation> getPackageEvaluationByClassUserId(Long classUserId) {
        return packageEvaluationRepository.getPackageEvaluationByClassUserId(classUserId);
    }

    @Override
    public float calculatePresentationByClassUserId(Long classUserId, boolean isPresentation, Long teamId, Long semesterId, String classType) {
//        PackageEvaluation packageEvaluation = packageEvaluationRepository.findPackageEvaluationByClassUserId(classUserId);
//        float sum = 0;
//        int count = 0;
//        for (byte i = 1; i <= 4; i++) {
//            if (i == 1) {
//                if (isPresentation) {
//                    Float value = packageEvaluation.getGrade_rv1();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                } else {
//                    Float value = packageEvaluation.getGrade_resit_rv1();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                }
//            } else if (i == 2) {
//                if (isPresentation) {
//                    Float value = packageEvaluation.getGrade_rv2();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                } else {
//                    Float value = packageEvaluation.getGrade_resit_rv2();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                }
//            } else if (i == 3) {
//                if (isPresentation) {
//                    Float value = packageEvaluation.getGrade_rv3();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                } else {
//                    Float value = packageEvaluation.getGrade_resit_rv3();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                }
//            } else {
//                if (isPresentation) {
//                    Float value = packageEvaluation.getGrade_rv4();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                } else {
//                    Float value = packageEvaluation.getGrade_resit_rv4();
//                    if (value != null) {
//                        sum += value;
//                        count++;
//                    }
//                }
//            }
//        }
//        if (count == calculateNumberReviewerByClass(classUserId)) {
//            if (isPresentation) {
//                classUserRepository.updateFinalPresEvalByTeamId((double) sum / count, teamId);
//                updateFinalGrade(semesterId, classType);
//            } else {
//                classUserRepository.updateFinalPresentationResitByTeamId((double) sum / count, teamId);
//                updateFinalGradeResit(semesterId, classType);
//            }
//            return sum / count;
//        } else {
        return 0;
//        }
    }


    public List<ClassUser> updateFinalGrade(Long semesterId, String classType) {
        List<ClassUser> classUsers = classUserRepository.findAll();
        EvaluationCriteria criteria = evaluationCriteriaRepository.findFirstBySemesterSemesterIdAndClassType(semesterId, classType);
        for (ClassUser classUser : classUsers) {
            if (classUser.getTotalOngoingEval() != null && classUser.getFinalPresEval() != null && classUser.getFinalPresentationResit() == null) {
                double totalOg = classUser.getTotalOngoingEval() * (1 - criteria.getFinalWeight() * 0.01);
                double finalPres = (classUser.getFinalPresEval() * criteria.getFinalWeight()) * 0.01;
                double finalGrade = totalOg + finalPres;
                classUser.setFinalGrade(finalGrade);
                classUserRepository.save(classUser);
            }
        }
        return classUsers;
    }

    public List<ClassUser> updateFinalGradeResit(Long semesterId, String classType) {
        List<ClassUser> classUsersResit = classUserRepository.findAll();
        EvaluationCriteria criteria = evaluationCriteriaRepository.findFirstBySemesterSemesterIdAndClassType(semesterId, classType);
        for (ClassUser classUser : classUsersResit) {
            if (classUser.getTotalOngoingEval() != null && classUser.getFinalPresEval() != null && classUser.getFinalPresentationResit() != null) {
                double totalOg = classUser.getTotalOngoingEval() * (1 - criteria.getFinalWeight() * 0.01);
                double finalPres = (classUser.getFinalPresentationResit() * criteria.getFinalWeight()) * 0.01;
                double finalGrade = totalOg + finalPres;
                classUser.setFinalGrade(finalGrade);
                classUserRepository.save(classUser);
            }
        }
        return classUsersResit;
    }

    public int calculateNumberReviewerByClass(Long classUserId) {
        Long classId = classUserRepository.findClassIdByClassUserId(classUserId);
        Class clazz = classRepository.findByClassId(classId);
        int result = 0;
        if (clazz.getReviewer1() != null) {
            result += 1;
        }
        if (clazz.getReviewer2() != null) {
            result += 1;
        }
        if (clazz.getReviewer3() != null) {
            result += 1;
        }
        if (clazz.getReviewer3() != null) {
            result += 1;
        }
        return result;
    }
}
