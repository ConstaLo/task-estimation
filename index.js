const getTestingExecutionTime = ({ testCasesCount, execTimeForOneTC, browsersCount }) => testCasesCount * execTimeForOneTC * browsersCount;
const getDefectsCount = ({ testCasesCount, avgDefectPercent, browsersCount }) => testCasesCount * (avgDefectPercent / 100) * browsersCount;
const getDefectReportingTime = ({ defectsCount, timeForOneDefect }) => defectsCount * timeForOneDefect;
const getResultWithRisks = (result, risks) => result + (result * (risks / 100));
const getTestingTimeWithoutRisks = (fields) => getTestingExecutionTime(fields)
    + (getDefectsCount(fields) * fields.reportingTimeForOneDefect)
    + fields.reportingTimeForTestResult;

const validate = (formElement) => {
    const errors = [];
    formElement.querySelectorAll('input[type=text]').forEach(input => {
        if (Number.isNaN(+input.value)) {
            errors.push(input.value)
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 5000)
        }
    });
    if (errors.length) alert(`Only numbers allowed`)
}

const formModule = document.getElementById('form-module');
formModule.addEventListener('submit', (event) => {
    event.preventDefault();
    validate(formModule)

    const fields = getCommonValues();

    const testingTimeWithoutRisks = getTestingTimeWithoutRisks(fields)
    const result = getResultWithRisks(testingTimeWithoutRisks, fields.risksPercent);

    document.getElementById('result-module').innerText = `${result.toFixed(2)}  h`;
});

const formCommon = document.getElementById('form-common');
formCommon.addEventListener('submit', (event) => {
    event.preventDefault();
    validate(formCommon);

    const fields = { ...getCommonValues('common'), ...getAdditionalValues() };

    const testingCreationTimeWithoutRisks = (fields.testCasesCount * fields.creationTimeForOneTC) + fields.testPlanCreationTime;
    const testingExecutionTimeWithoutRisks = getTestingTimeWithoutRisks(fields);
    const testingTime = (testingCreationTimeWithoutRisks + testingExecutionTimeWithoutRisks + fields.requirementAnalysisTime) / fields.teamMembersCount;
    const resultWithoutRisks = testingTime + fields.envInstallationTime + fields.buildInstallationTime;

    const result = getResultWithRisks(getResultWithRisks(resultWithoutRisks, fields.communicationTimePercent), fields.risksPercent);

    document.getElementById('result-common').innerText = `${result.toFixed(2)}  h`;
});

const getCommonValues = (type = 'module') => ({
    testCasesCount: +document.getElementById(`test-cases-count-${type}`).value,
    execTimeForOneTC: (+document.getElementById(`exec-time-for-1-tc-${type}`).value) / 60,
    browsersCount: +document.getElementById(`browsers-count-${type}`).value,
    avgDefectPercent: +document.getElementById(`average-defects-percent-${type}`).value,
    reportingTimeForOneDefect: (+document.getElementById(`defect-reporting-time-for-1-de-${type}`).value) / 60,
    reportingTimeForTestResult: +document.getElementById(`test-result-report-time-${type}`).value,
    risksPercent: +document.getElementById(`percent-time-for-risks-${type}`).value,
});

const getAdditionalValues = () => ({
    testPlanCreationTime: +document.getElementById('test-plan-creation-time').value,
    creationTimeForOneTC: (+document.getElementById('creation-time-for-1-tc').value) / 60,
    teamMembersCount: +document.getElementById('team-members-count').value,
    envInstallationTime: +document.getElementById('env-install-time').value,
    buildInstallationTime: (+document.getElementById('build-install-time').value) / 60,
    communicationTimePercent: +document.getElementById('communication-time').value,
    requirementAnalysisTime: +document.getElementById('requirements-analysis').value,
})
